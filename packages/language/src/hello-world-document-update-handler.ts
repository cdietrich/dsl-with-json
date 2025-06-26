import { DefaultDocumentUpdateHandler } from 'langium/lsp';
import { DidChangeWatchedFilesNotification, type DidChangeWatchedFilesParams, type DidChangeWatchedFilesRegistrationOptions, type FileSystemWatcher } from 'vscode-languageserver';
import type { LangiumSharedServices } from 'langium/lsp';
import { stream } from 'langium';

/**
 * Custom document update handler that extends the default Langium handler
 * and provides custom behavior for didChangeWatchedFiles.
 */
export class HelloWorldDocumentUpdateHandler extends DefaultDocumentUpdateHandler {
    
    constructor(services: LangiumSharedServices) {
        super(services);
    }

    /**
     * Override the didChangeWatchedFiles method to add custom behavior
     * while maintaining the default Langium functionality.
     */
    override didChangeWatchedFiles(params: DidChangeWatchedFilesParams): void {
        console.log("[HelloWorld] Custom didChangeWatchedFiles handler invoked");
        super.didChangeWatchedFiles(params);
        
        
        // Add your custom logic here
        console.log(`[HelloWorld] Watched files changed: ${params.changes.length} files`);
        
        // Example: Log details about changed files
        for (const change of params.changes) {
            console.log(`[HelloWorld] File ${change.uri} changed (type: ${change.type})`);
            
            // Example: Handle .hello files specifically
            if (change.uri.endsWith('.hello')) {
                console.log(`[HelloWorld] HelloWorld DSL file detected: ${change.uri}`);
                // Add your custom .hello file handling logic here
            }
        }
        
        // Example: You could add custom logic such as:
        // - Custom validation triggers
        // - Cache invalidation
        // - External tool integration
        // - Custom file watching patterns
        // - Integration with build systems
    }


    protected override registerFileWatcher(services: LangiumSharedServices): void {
        const watchers: FileSystemWatcher[] = [];
        // extensions
        const fileExtensions = stream(services.ServiceRegistry.all)
            .flatMap(language => language.LanguageMetaData.fileExtensions)
            .map(ext => ext.startsWith('.') ? ext.substring(1) : ext)
            .distinct()
            .toArray();
        if (fileExtensions.length > 0) {
            watchers.push({
                globPattern: fileExtensions.length === 1
                    ? `**/*.${fileExtensions[0]}`
                    : `**/*.{${fileExtensions.join(',')}}`
            });
        }
        // filenames
        const fileNames = stream(services.ServiceRegistry.all)
            .flatMap(language => language.LanguageMetaData.fileNames ?? [])
            .distinct()
            .toArray();
        if (fileNames.length > 0) {
            watchers.push({
                globPattern: fileNames.length === 1
                    ? `**/${fileNames[0]}`
                    : `**/{${fileNames.join(',')}}`
            });
        }
        
        watchers.push({
            "globPattern": "**/*.action-definition.json"
        })
        console.log("Hello from watchers ", JSON.stringify(watchers, null, 2));
        if (watchers.length > 0) {
            const connection = services.lsp.Connection;
            const options: DidChangeWatchedFilesRegistrationOptions = { watchers };
            connection?.client.register(DidChangeWatchedFilesNotification.type, options);
        }
    }
}
