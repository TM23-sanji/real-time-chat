import { WebContainer } from "@webcontainer/api";

let webContainerInstance: WebContainer | null = null;

export async function getWebContainer() {
    if (webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot();
    }
    return webContainerInstance;
}