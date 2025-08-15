"use client";

import FileUploadList from "@/components/layout/FileUploadList";
import { SiswaType } from "@/types";
import {
	Button,
	Field,
	FileUpload,
	Heading,
	Input,
	VStack,
} from "@chakra-ui/react";
import { FileImage } from "lucide-react";
import { useForm } from "react-hook-form";

export default function SiswaCreate() {
	const { register, handleSubmit } = useForm<SiswaType>();

	const onSubmit = (data: SiswaType) => console.log(data);

	return (
		<VStack mx="10em" mt="2em">
			<Heading>Siswa Create</Heading>

			<VStack w="100%" gap="1em" asChild>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Field.Root>
						<Field.Label>Nama</Field.Label>
						<Input {...register("name")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Tempat, Tanggal Lahir</Field.Label>
						<Input {...register("tempat_tanggal_lahir")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Instagram</Field.Label>
						<Input {...register("instagram")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Tiktok</Field.Label>
						<Input {...register("tiktok")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Hobi</Field.Label>
						<Input {...register("hobi")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Quotes</Field.Label>
						<Input {...register("quotes")} />
					</Field.Root>

					<Field.Root>
						<Field.Label>Foto Formal</Field.Label>
						<FileUpload.Root accept="image/*">
							<FileUpload.HiddenInput {...register("foto")} />
							<FileUpload.Dropzone unstyled>
								<FileUpload.Trigger asChild>
									<Button variant="outline" size="sm">
										<FileImage /> Upload Images
									</Button>
								</FileUpload.Trigger>
							</FileUpload.Dropzone>
							<FileUploadList />
						</FileUpload.Root>
					</Field.Root>
					<Button type="submit">Submit</Button>
				</form>
			</VStack>
		</VStack>
	);
}
