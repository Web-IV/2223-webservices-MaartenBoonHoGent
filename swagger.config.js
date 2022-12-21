module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API documentation for WebsiteAPI",
      version: "0.1.0",
      description:
        "This is the API documentation for the WebsiteAPI.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "WebsiteAPI",
        url: "",
        email: "maarten.boon@student.hogent.be",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./src/rest/*.js"],
};