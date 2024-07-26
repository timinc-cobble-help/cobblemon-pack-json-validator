import JSZip from 'jszip';

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
                            JSON.parse(fileContent);
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
    })
};

export { validateJsonsInZip }