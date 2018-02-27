import fs from 'fs';

export default {
    writeFile: (filename, content) => {
        fs.writeFileSync(filename, content);
    }
}