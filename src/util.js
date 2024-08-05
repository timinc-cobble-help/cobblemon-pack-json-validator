import JSZip from 'jszip';
import validate from "./jsonutil";
import { jsonrepair } from "jsonrepair";

const validateJsonsInZip = async (file) => {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve) => {
        const zip = new JSZip();
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const content = e.target.result;
                const loadedZip = await zip.loadAsync(content);
                const newResults = [];

                for (const filename of Object.keys(loadedZip.files)) {
                    if (filename.endsWith('.json')) {
                        const fileContent = await loadedZip.file(filename).async('string');
                        try {
                            validate(fileContent);
                            newResults.push({ filename, valid: true, error: null });
                        } catch (err) {
                            newResults.push({ filename, valid: false, error: err.message });
                        }
                    }
                }

                resolve(newResults);
            } catch (err) {
                resolve([{ filename: 'Error', valid: false, error: err.message }]);
            }
        };

        reader.readAsArrayBuffer(file);
    });
};

const repairJsonsInZip = async (file) => {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve) => {
        const zip = new JSZip();
        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target.result;
            const loadedZip = await zip.loadAsync(content);
            const newFile = new JSZip();

            for (const filename of Object.keys(loadedZip.files)) {
                try {
                    const fileContent = await loadedZip.file(filename).async('string');
                    newFile.file(filename, filename.endsWith(".json") ? jsonrepair(fileContent) : fileContent);
                } catch (error) {
                    console.log(error);
                }
            }

            resolve(newFile.generateAsync({ type: "blob" }));
        };

        reader.readAsArrayBuffer(file);
    });
};

export { validateJsonsInZip, repairJsonsInZip };