"use client";

import { FileUpload, Float, useFileUploadContext } from "@chakra-ui/react";
import { X } from "lucide-react";

const FileUploadList = () => {
	const fileUpload = useFileUploadContext();
	const files = fileUpload.acceptedFiles;
	if (files.length === 0) return null;
	return (
		<FileUpload.ItemGroup>
			{files.map((file) => (
				<FileUpload.Item
					w="auto"
					boxSize="20"
					p="2"
					file={file}
					key={file.name}
				>
					<FileUpload.ItemPreviewImage />
					<Float placement="top-end">
						<FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
							<X />
						</FileUpload.ItemDeleteTrigger>
					</Float>
				</FileUpload.Item>
			))}
		</FileUpload.ItemGroup>
	);
};

export default FileUploadList;
