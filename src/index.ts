import { createFilter } from "@rollup/pluginutils";
import { shim, virtualSheet, getStyleTag } from "twind/shim/server";
import { setup, Configuration as TWindConfig } from "twind";
import { walk } from "estree-walker";
import MagicString from "magic-string";
import { Program } from "estree";
import path from "path";

type Options = {
    include?: string[];
    exclude?: string[];
    mode?: "emit" | "inject";
    twindConfig?: TWindConfig;
    emittedFileName?: string;
};

const DEFAULT_OPTIONS: Options = {
    include: ["**/*.ce.vue"],
    mode: "inject",
    emittedFileName: "[name].[ext]",
};

const sheet = virtualSheet();

const markNode = (node: any): void => {
    node._marked = true;
};

const assertNodeType = (node: any, nodeType: string) => {
    if (node.type !== nodeType) {
        throw new Error(`Expected node to be of type ${nodeType}`);
    }
};

const getFileParts = (fn: string) => path.basename(fn).split(".");

const stringify = (argsObj: string[][]): string =>
    `[${argsObj
        .map(
            (a: string[]) =>
                `["${a[0]}", ${
                    Array.isArray(a[1]) ? `[${a[1].join(", ")}]` : a[1]
                }]`
        )
        .join(", ")}]`;

const getSFCClassNames = (ast: Program): string => {
    /**
     * Walk through SFC AST collecting class names
     **/
    const classNames: string[] = [];

    walk(ast, {
        enter(node: any) {
            if (
                node.type === "Property" &&
                node.key.name === "class" &&
                node.value
            ) {
                markNode(node.value);
            } else if (node._marked) {
                if (node.type === "Literal" && node.value) {
                    classNames.push(node.value);
                } else if (node.type === "TemplateLiteral") {
                    for (const quasi of node.quasis) {
                        const cooked: string | undefined = quasi.value?.cooked;
                        cooked && classNames.push(cooked);
                    }
                } else if (
                    node.type === "CallExpression" &&
                    node.callee.name === "_normalizeClass"
                ) {
                    // `class` is bound to an object e.g. `:class="[['foo', {bar: 'baz'}]]`
                    // `_normalizeClass` takes this object as its first parameter
                    markNode(node.arguments[0]);
                } else if (node.type === "ArrayExpression") {
                    node.elements.forEach(markNode);
                } else if (node.type === "ObjectExpression") {
                    for (const prop of node.properties) {
                        classNames.push(prop.key.value);
                    }
                }
                delete node._marked;
            }
        },
    });
    return classNames.join(" ");
};

const injectStyles = (
    ast: Program,
    src: string,
    styles: string
): MagicString => {
    /**
     * Inject generated CSS string into vue module JS.
     */
    const magicSrc = new MagicString(src);

    walk(ast, {
        enter(node: any) {
            magicSrc.addSourcemapLocation(node.start);
            magicSrc.addSourcemapLocation(node.end);

            if (node.type === "ExportDefaultDeclaration") {
                if (node.declaration.type === "Identifier") {
                    // If the module is exported as `export default _sfc_main;`,
                    // Overwrite this export with an `_export_sfc` wrapper that includes the generated CSS in the `styles` array.
                    magicSrc.overwrite(
                        node.start,
                        node.end,
                        `import _export_sfc from "plugin-vue:export-helper";\nexport default /* @__PURE__ */ _export_sfc(_sfc_main, [["styles", [\`${styles}\`]]]);`
                    );
                }
            } else if (
                node.type === "CallExpression" &&
                node.callee.name === "_export_sfc"
            ) {
                // Otherwise break up the components of the existing `_export_sfc` function and
                // piece them back together with the generated tailwind styles included.

                const exportArgs = node.arguments[1]; // e.g. `[["render", _sfc_render], ["styles", [_style_0]]]`
                const exportArgsObj: any = [["styles", [`\`${styles}\``]]];
                assertNodeType(exportArgs, "ArrayExpression");

                for (const arg of exportArgs.elements) {
                    assertNodeType(arg, "ArrayExpression");
                    const key = arg.elements[0].value; // e.g. `render`, `style`
                    const valueNode = arg.elements[1];

                    if (key === "styles") {
                        assertNodeType(valueNode, "ArrayExpression");
                        for (const styleArg of valueNode.elements) {
                            exportArgsObj
                                .find((o: any[]) => o[0] === "styles")[1]
                                .push(styleArg.name);
                        }
                    } else {
                        exportArgsObj.push([
                            key,
                            magicSrc.slice(valueNode.start, valueNode.end),
                        ]);
                    }
                }
                magicSrc.overwrite(
                    exportArgs.start,
                    exportArgs.end,
                    stringify(exportArgsObj)
                );
            }
        },
    });
    return magicSrc;
};

export default function (userOptions: Options = {}) {
    const options: Options = { ...DEFAULT_OPTIONS, ...userOptions };
    const filter = createFilter(options.include, options.exclude);

    setup({
        preflight: false,
        ...options.twindConfig,
        sheet,
    });

    return {
        name: "rollup-plugin-vue-wc-tailwind",
        transform(this: any, src: string, id: string) {
            if (!filter(id)) return;

            const ast: Program = this.parse(src);
            const classNames = getSFCClassNames(ast);

            sheet.reset();
            // Extract classNames into `sheet`
            shim(`<div class="${classNames}"></div>`);
            const styles = getStyleTag(sheet)
                .replace('<style id="__twind">', "")
                .replace("</style>", "");

            if (options.mode === "inject") {
                const magicSrc = injectStyles(ast, src, styles);

                return {
                    code: magicSrc.toString(),
                    map: magicSrc.generateMap(),
                };
            } else if (options.mode === "emit") {
                const fileParts = getFileParts(id);
                const fileName = options.emittedFileName
                    ?.replace("[name]", fileParts[0])
                    .replace("[ext]", fileParts[1]);
                this.emitFile({
                    type: "asset",
                    fileName: `${fileName}.css`,
                    source: styles,
                });
                return src;
            } else {
                throw new Error(
                    `Unknown mode "${options.mode}" - Must be "inject" or "emit"`
                );
            }
        },
    };
}
