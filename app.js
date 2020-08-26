#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const beautifyer = require("js-beautify").js_beautify;

const inquirer = require("inquirer");
const chalkPipe = require("chalk-pipe");

let fileName;
let SchemaName;
let results = [];

console.log(`
███╗░░░███╗░█████╗░██████╗░░░░░░░░█████╗░██╗░░░░░██╗
████╗░████║██╔══██╗██╔══██╗░░░░░░██╔══██╗██║░░░░░██║
██╔████╔██║██║░░╚═╝██║░░██║█████╗██║░░╚═╝██║░░░░░██║
██║╚██╔╝██║██║░░██╗██║░░██║╚════╝██║░░██╗██║░░░░░██║
██║░╚═╝░██║╚█████╔╝██████╔╝░░░░░░╚█████╔╝███████╗██║
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░░░░░░░░╚════╝░╚══════╝╚═╝`);
console.log(`
╭━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━╮
╰━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━╯`);
console.log(`Mongoose Schema Generator tool by `);
console.log(`
╭━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━┳━━╮
╰━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━┻━━╯`);
console.log(`Cʜɪʀᴀɢ Pɪᴘᴀʟɪʏᴀ`);

var questions = [
  {
    type: "input",
    name: "file_name",
    message: "what will be the model name?",
    validate: function (input) {
      if (input.length <= 0) {
        return false;
      }
      return true;
    },
  },
  {
    type: "input",
    name: "schema_name",
    message: "what will be the Schema name?",
    validate: function (input) {
      if (input.length <= 0) {
        return false;
      }
      return true;
    },
  },
];

inquirer.prompt(questions).then((answers) => {
  fileName = answers.file_name;
  SchemaName = answers.schema_name;
  var questions = [
    {
      type: "input",
      name: "field_name",
      message: "field name",
    },
    {
      type: "list",
      name: "type",
      message: "Select field type",
      choices: [
        "String",
        "Number",
        "Boolean",
        "Date",
        "buffer",
        "ObjectId",
        "Array",
      ],
    },
    {
      type: "checkbox",
      message: "please select another field",
      name: "type2",
      choices: function (answer) {
        switch (answer.type) {
          case "String":
            return [
              "required",
              "uniqiue",
              "lowercase",
              "uppercase",
              "minlength",
              "maxlength",
              "enum",
              "trim",
              "validate",
              "default",
            ];
          case "Number":
            return ["required", "uniqiue", "min", "max", "validate", "default"];
          case "Boolean":
            return ["required", "validate", "uniqiue", "default"];

          case "Date":
            return ["required", "validate", "uniqiue", "default"];
          case "buffer":
            return ["required", "default"];
          case "ObjectId":
            return ["required", "validate", "uniqiue", "default", "ref"];
          case "Array":
            return ["required", "validate", "uniqiue", "default"];
          default:
            return [];
        }
      },
    },
    {
      type: "number",
      name: "minlength",
      message: "enter minlength of field",
      when: function (answer) {
        return answer.type2.includes("minlength");
      },
    },
    {
      type: "number",
      name: "maxlength",
      message: "enter maxlength of field",
      when: function (answer) {
        return answer.type2.includes("maxlength");
      },
    },
    {
      type: "number",
      name: "min",
      message: "enter min of field",
      when: function (answer) {
        return answer.type2.includes("min");
      },
    },
    {
      type: "number",
      name: "max",
      message: "enter max of field",
      when: function (answer) {
        return answer.type2.includes("max");
      },
    },
    {
      type: "input",
      name: "enum",
      message: "enter enum field example-> 'admin','root','user' ",
      when: function (answer) {
        return answer.type2.includes("enum");
      },
    },
    {
      type: "editor",
      name: "validate",
      message: "enter validate function",
      when: function (answer) {
        return answer.type2.includes("validate");
      },
    },
    {
      type: "input",
      name: "default",
      message: "enter default value for upper value ",
      when: function (answer) {
        return answer.type2.includes("default");
      },
    },
    {
      type: "input",
      name: "ref",
      message: "please input ref model",
      when: function (answer) {
        return answer.type2.includes("ref");
      },
    },
    {
      type: "confirm",
      name: "askAgain",
      message: "Want to add more fields (just hit enter for YES)?",
      default: true,
    },
  ];

  function ask() {
    inquirer.prompt(questions).then((answers) => {
      results.push(answers);
      if (answers.askAgain) {
        ask();
      } else {
        console.log("done");
        writeFile();
      }
    });
  }
  ask();
});
//

function writeFile() {
  const outputFileTemplate = `
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  
  const ${SchemaName}Schema = new Schema ({
      ${results.map((result) => {
        return `${result.field_name}:{
                      type:${result.type},
                      ${result.type2.map((type) => {
                        switch (type) {
                          case "required":
                            return `required:true\n`;
                          case "uniqiue":
                            return `unique:true\n`;
                          case "uppercase":
                            return `uppercase:true\n`;
                          case "lowercase":
                            return `lowercase:true\n`;
                          case "trim":
                            return `trim:true\n`;
                          case "minlength":
                            return `minlength:${result.minlength}\n`;
                          case "maxlength":
                            return `maxlength:${result.maxlength}\n`;
                          case "enum":
                            return `enum:[${result.enum}]\n`;
                          case "validate":
                            return `validate:${result.validate
                              .replace("\r", "")
                              .replace("\n", "")}\n`;
                          case "default":
                            return `default:"${result.default}"\n`;
                          case "min":
                            return `min:${result.min}\n`;
                          case "max":
                            return `max:${result.max}\n`;
                          case "ref":
                            return `ref:Schema.Types.${result.ref}\n`;
                        }
                      })}
                  }`;
      })}
  })
  
  module.exports = mongose.model('${SchemaName.toLowerCase()}',${SchemaName.toLowerCase()}Schema);
  `;

  let outputtedFile = beautifyer(outputFileTemplate);
  const fname = `${path.join(process.cwd(), "models", fileName)}`;
  fs.writeFile(`${fname}.js`, outputtedFile, (err) => {
    if (err) {
      console.log(`Something wrong Error: ${err}`);
      return;
    }
    console.log("your schema is generated");
    console.log(`Created!! in the directory  ${fileName}.js`);
  });
}
