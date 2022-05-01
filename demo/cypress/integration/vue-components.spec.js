const PREVIEW_URL = "http://localhost:3000";

const validateElStyles = (dataCy, hasStyles) => {
    cy.get(`[data-cy=${dataCy}]`)
        .find("button").as("btn")
        .should("have.css", "background-color")
        .and("eq", "rgb(167, 243, 208)"); // bg-green-200

    cy.get("@btn").click();

    cy.get("@btn")
        .should("have.css", "background-color")
        .and("eq", "rgb(253, 230, 138)"); // bg-yellow-200

    cy.get("@btn")
        .should("have.css", "font-size")
        .and("eq", hasStyles ? "24px" : "16px");
}

describe("Report rendering", () => {
    before(() => {
        cy.visit(PREVIEW_URL);
    });

    it("Should validate style of a Composition API component with a `style` tag", () => {
        validateElStyles("composition-api-styles", true);
    });

    it("Should validate style of a Composition API component with no `style` tag", () => {
        validateElStyles("composition-api-no-styles");
    });
    
    it("Should validate style of an Object API component with a `style` tag", () => {
        validateElStyles("object-api-styles", true);
    });

    it("Should validate style of an Object API component with no `style` tag", () => {
        validateElStyles("object-api-no-styles");
    });
});