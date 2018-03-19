import fs from 'fs';

export default {
    writeFile: (filename, content) => {
        fs.writeFileSync(filename, content);
    },
    readJsonFile: (filename) => {
        var content = fs.readFileSync(filename);
        return JSON.parse(content)
    }
}