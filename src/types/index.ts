export type SiswaType = {
	id: string;
	name: string;
	tanggal_lahir: string;
	media_sosial: MediaSosialType[];
	hobi: string;
  quotes: string;
	foto: string;
};

export type MediaSosialType = {
	id: string;
	app: string;
	username: string;
};
