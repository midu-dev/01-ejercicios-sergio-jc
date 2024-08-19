const fs = require("node:fs/promises");
const path = require("node:path");

const ERROR_CODES = Object.freeze({ NO_ENTRY: "ENOENT" });

// Ejercicio 2
async function writeFile(filePath, data, callback) {
  try {
    await fs.stat(filePath);
  } catch (err) {
    if (err.code === ERROR_CODES.NO_ENTRY) {
      const filePathDirname = path.dirname(filePath);
      await fs.mkdir(path.join(__dirname, filePathDirname));
    }
  }
  try {
    await fs.writeFile(filePath, data);
    return callback(null);
  } catch (error) {
    return callback(error);
  }
}

const MESSAGE_LIST = Object.freeze({
  NO_PATH: "No se ha especificado el path del archivo",
  NO_WORD: "No se ha especificado la palabra a buscar",
});

// Ejercicio 3
async function readFileAndCount(word, callback) {
  const NO_WORD_MATCHES = 0;
  let proccessError = null;
  const file = process.argv[2];
  if (!file) {
    proccessError = MESSAGE_LIST.NO_PATH;
    return callback(new Error(proccessError), NO_WORD_MATCHES);
  }
  if (!word) {
    proccessError = MESSAGE_LIST.NO_WORD;
    return callback(new Error(proccessError), NO_WORD_MATCHES);
  }
  let reading;
  try {
    reading = await fs.readFile(file, "utf-8");
  } catch (error) {
    return callback(proccessError, NO_WORD_MATCHES);
  }
  const dynamicRegex = new RegExp(word, "g");
  const matchingWords = reading.match(dynamicRegex);
  return callback(proccessError, matchingWords?.length ?? NO_WORD_MATCHES);
}

module.exports = {
  writeFile,
  readFileAndCount,
};

//* secio-note: Otra forma de encontrar las palabras que coincidan con el texto: data.split(word).length - 1 (recuerda el dilema de la cadena);
