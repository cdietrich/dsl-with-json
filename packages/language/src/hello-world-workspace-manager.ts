import { DefaultWorkspaceManager, LangiumDocument, WorkspaceFolder } from "langium";

export class HelloWorldWorkspaceManager extends DefaultWorkspaceManager {

    protected override async loadAdditionalDocuments(_folders: WorkspaceFolder[], _collector: (document: LangiumDocument) => void): Promise<void> {
        console.log("[HelloWorld] Custom loadAdditionalDocuments invoked", JSON.stringify(_folders, null, 2));
        return;
    }

}