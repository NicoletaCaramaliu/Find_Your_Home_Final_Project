describe("Pagina de Autentificare", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("afișează formularul corect", () => {
    cy.contains("Autentificare").should("be.visible");
    cy.get("input[type='email']").should("exist");
    cy.get("input[type='password']").should("exist");
    cy.get("button").contains(/autentificare|login/i).should("exist");
  });

  it("permite autentificare cu date valide", () => {
    cy.intercept("POST", "**/api/Auth/login").as("loginRequest");

    cy.get("input[type='email']").type("caramaliu.nicoleta@gmail.com");
    cy.get("input[type='password']").type("Nicoleta113*");

    cy.get("button").contains(/autentificare|login/i).click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    //redirect
    cy.url().should("include", "/home");
  });

  it("afișează eroare la date greșite", () => {
    cy.intercept("POST", "**/api/Auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" }
    }).as("loginFail");

    cy.get("input[type='email']").type("caramaliu.nicoleta@gmail.com");
    cy.get("input[type='password']").type("Nicoleta123*");

    cy.get("button").contains(/autentificare|login/i).click();

    cy.wait("@loginFail");
    cy.contains("A apărut o eroare necunoscută.").should("be.visible");
  });
});
