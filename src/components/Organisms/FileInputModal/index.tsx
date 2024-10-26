import { MenuContext } from "@/contexts/MenuContext";
import { Modal } from "flowbite-react";
import { ChangeEvent, MutableRefObject, useContext } from "react";
import { GrDocument } from "react-icons/gr";
import { IoDocument } from "react-icons/io5";
import { IoIosImages } from "react-icons/io";




type props = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
}

const FileInputModal = ({ files, setFiles, fileInputRef }: props) => {

    const menuCtx = useContext(MenuContext)!;

    const handleLabelDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleLabelDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.dataTransfer.files));
        menuCtx.setShowFileInput(false);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.target.files!));
        menuCtx.setShowFileInput(false);
    }

    return (
    <Modal show={menuCtx.showFileInput} onClose={() => menuCtx.setShowFileInput(false)}>
    <Modal.Header>
        <h2 className="text-lg font-semibold">Enviar Arquivos</h2>
    </Modal.Header>
    <Modal.Body>
        <div className="flex flex-col items-center justify-center">
            <div className="flex space-x-4"> {/* Adicionando um contêiner flexível */}

            <div className="flex flex-col items-center">
            <IoDocument
                className={`w-8 h-8 fill-gray-500/60 rounded-full ${
                    menuCtx.showFileInput ? "cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500" : "cursor-default"
                }`}
                onClick={() => fileInputRef.current?.click()} // Abre o seletor de arquivos
                />
                <span className="text-gray-500 mt-1">documento</span>
            </div>

                
            <div className="flex flex-col items-center">
                <IoIosImages
                    className={`w-10 h-8 fill-gray-500/60 rounded-full ${
                        menuCtx.showFileInput ? "cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500" : "cursor-default"
                    }`}
                    onClick={() => fileInputRef.current?.click()} // Abre o seletor de arquivos
                />
                <span className="text-gray-500 mt-1">figurinha</span>
            </div>
                
            </div>
            {files.length > 0 ? (
                <div className="mt-4">
                    {files.map((file, idx) => (
                        <div key={idx} className="py-1">
                            {file.name} {/* Exibe o nome do arquivo */}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-gray-500"></p>
            )}
            <input
                id="files"
                type="file"
                onChange={handleInputChange}
                multiple
                hidden
                ref={fileInputRef}
            />
        </div>
    </Modal.Body>
</Modal>

    );
};


export default FileInputModal;