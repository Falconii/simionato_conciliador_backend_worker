const credencialSrv = require("../../shared/service/credencialService");
const { google } = require("googleapis");
const PORT = process.env.PORT || 3000;
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

async function listFiles(driveService, folderId, tamPage, onePage) {
    try {
        let retorno = [];
        let tamMinino = 1363149;
        let pageToken = null;
        let totalFiles = 0;

        do {
            const res = await driveService.files.list({
                q: `'${folderId}' in parents `,
                spaces: "drive",
                pageSize: tamPage,
                fields: "nextPageToken, files(id, name, size, modifiedTime)",
                pageToken: pageToken,
            });
            const files = res.data.files;
            totalFiles += files.length;
            await Promise.all(
                files.map(async(file) => {
                    let tam = "Não Definido";
                    let size = 0;
                    let unid = "";
                    if (file.size < 1014 * 1024) {
                        size = (file.size / 1024).toFixed(2);
                        unid = "KB";
                    } else {
                        size = (file.size / (1024 * 1024)).toFixed(2);
                        unid = "MB";
                    }
                    tam = `${size} ${unid}`;
                    const dir = {
                        id_file: file.id,
                        id_pasta: folderId,
                        name_file: file.name,
                        size: tam,
                        data: file.modifiedTime,
                    };
                    //const arq = await arquivoSrv.insertArquivo(dir);
                    retorno.push(dir);
                }),
            );
            pageToken = res.data.nextPageToken;
        } while (onePage ? false : pageToken);
        console.log(`Total De Arquivos: ${totalFiles}`);
        return retorno;
    } catch (err) {
        console.error("Erro ao listar arquivos:", err);
    }
}

async function getFileOwner(driveService, fileId) {
    try {
        var lsOwner = [];

        const response = await driveService.files.get({
            fileId: fileId,
            fields: "owners",
        });
        const owners = response.data.owners;
        owners.forEach((owner) => {
            const dono = { Owner: owner.displayName, Email: owner.emailAddress };
            lsOwner.push(dono);
        });

        return lsOwner;
    } catch (error) {
        throw error;
    }
}

exports.checkStorageQuota = async function(driveService) {
    try {
        const about = await driveService.about.get({
            fields: "storageQuota",
        });

        const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(2); // GB
        const toMB = (bytes) => (bytes / 1024 ** 2).toFixed(2); // MB
        const toKB = (bytes) => (bytes / 1024).toFixed(2);

        const totalStorage = toGB(about.data.storageQuota.limit); // GB
        const usedStorage = toMB(about.data.storageQuota.usage); // MB
        const remainingStorage = toKB(
            about.data.storageQuota.limit - about.data.storageQuota.usage,
        ); // GB

        return {
            origem: "GOOGLE OAUTH 2.0",
            free: remainingStorage,
            usado: usedStorage,
            total: totalStorage,
        };
    } catch (error) {
        throw error;
    }
};

exports.loadCredencials = async function(id) {
    try {
        const credencial = await credencialSrv.getCredencial(1);

        const client_id = credencial.client_id;
        const client_secret = credencial.client_secret;
        const client_uri = credencial.redirect_uri;
        const tokens = credencial.tokens;

        return {
            client_id: client_id,
            client_secret: client_secret,
            client_uri: client_uri,
            tokens: tokens,
        };
    } catch (error) {
        throw error;
    }
};

exports.getoauth2Client = function(params) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            params.client_id,
            params.client_secret,
            params.client_uri,
        );

        oauth2Client.setCredentials(JSON.parse(params.tokens));

        return oauth2Client;
    } catch (error) {
        throw error;
    }
};

exports.saveFile = async function(
    driveService,
    file,
    folderId,
    googleFileName,
) {
    console.log("entrei na saveFile", googleFileName, folderId);
    try {
        const resp = await this.existFileByName(
            driveService,
            googleFileName,
            folderId,
        );

        console.log("Passei pelo exists 2", resp);

        if (resp.exists) {
            return {
                message: "Arquivo Já Existe Na Pasta! GOOGLE DRIVE",
                data: null,
            };
        }
        console.log("Passei pelo exists 3");
        const response = await driveService.files.create({
            requestBody: {
                name: googleFileName,
                mimeType: file.mimeType,
                parents: [folderId],
            },
            media: {
                mimeType: file.mimeType,
                body: fs.createReadStream(`./upload/${file.originalname}`),
            },
        });
        return { message: "Imagem Salva Com Sucesso!", data: response.data };
    } catch (error) {
        console.log("Erro:", error);
        throw error;
    }
};

exports.deleteFile = async function(driveService, fileId) {
    try {
        const response = await driveService.files.delete({
            fileId: fileId,
        });

        return { result: true };
    } catch (error) {
        throw error;
    }
};

exports.existFile = async function(driveService, fileId) {
    try {
        let existe = false;

        const response = await driveService.files.get({
            fileId: fileId,
        });

        existe = true;

        return { result: existe, data: response.data };
    } catch (error) {
        throw error;
    }
};

exports.existFileByName = async function(driveService, fileName, folderId) {
    try {
        // Escapa aspas duplas para não quebrar a query
        const safeName = fileName.replace(/"/g, '\\"');
        console.log("safeName", safeName);
        const res = await driveService.files.list({
            q: `'${folderId}' in parents and name="${safeName}" and trashed=false`,
            fields: "files(id, name)",
        });
        console.log("Passei pelo exists dentro", res.data.files);
        return { exists: res.data.files.length > 0 };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.renameFile = async function(driveService, fileId, newName) {
    const body = {
        name: newName,
    };

    try {
        const response = await driveService.files.update({
            fileId: fileId,
            resource: body,
        });

        console.log("Retorno Do Google: ", response);

        return { message: "Nome Alterado Com Sucesso!" };
    } catch (error) {
        throw error;
    }
};

exports.downloadFile = async function(driveService, fileId) {
    try {
        //buscar informações
        const response = await driveService.files.get({
            fileId: fileId,
            fields: "name, size",
        });

        const fileName = response.data.name;
        const fileSize = response.data.size;

        console.log(fileName, fileSize);

        const file = await driveService.files.get({
            fileId: fileId,
            alt: "media",
        });
        console.log("file.config.data", file.config.data);

        const bufferSymbol = Object.getOwnPropertySymbols(file.data).find(
            (symbol) => symbol.toString() === "Symbol(buffer)",
        );
        const buffer = file.data[bufferSymbol];

        const metadata = await sharp(buffer).metadata();

        console.log(metadata.orientation);

        // Escrever o buffer em um arquivo
        fs.writeFile(`./fotos/${fileName}`, buffer, (err) => {
            if (err) {
                console.error("Erro ao salvar o arquivo:", err);
            } else {
                console.log("Arquivo salvo com sucesso!");
            }
        });

        //resize a foto com 50%

        await resizeImageFromBuffer(buffer, `./fotos/foto_menor.jpg`, 40, 40);

        return { message: "Foto Redimensionada!" };
    } catch (err) {
        throw err;
    }
};

exports.showPicture = async function(driveService, fileId) {
    try {
        const file = await driveService.files.get({
            fileId: fileId,
            alt: "media",
        });

        const bufferSymbol = Object.getOwnPropertySymbols(file.data).find(
            (symbol) => symbol.toString() === "Symbol(buffer)",
        );
        const buffer = file.data[bufferSymbol];

        return await resizeImageToBuffer(buffer, 30, 30);

        //return await resizeImagePixel(buffer,70,70);
    } catch (err) {
        throw err;
    }

    /*
                                                                        Rotinas para compactar fotos no inventário Na mesma Pasta
                                                                      */
};

exports.diretorio = async function(driveService, folderId) {
    try {
        const dir = await listFiles(driveService, folderId, 200, false);

        return dir;
    } catch (error) {
        throw error;
    }
};

exports.changeFileNameGoogleDrive = async function(driveService, foto) {
    let arquivo = "";
    try {
        try {
            const body = {
                name: foto.file_name,
            };

            const response = await driveService.files.update({
                fileId: foto.id_pasta,
                resource: body,
            });

            console.log("Retorno Do Google: ", response);
        } catch (err) {
            throw err;
        }
    } catch (err) {
        if (err.name == "MyExceptionDB") {
            res.status(409).json(err);
        } else {
            res
                .status(500)
                .json({ erro: "BAK-END", tabela: "Foto", message: err.message });
        }
    }
};

exports.owner = async function(driveService, fileId) {
    try {
        const lsOwners = await getFileOwner(driveService, fileId);

        return lsOwners;
    } catch (error) {
        throw error;
    }
};