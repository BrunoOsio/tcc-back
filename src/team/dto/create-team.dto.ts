import { CreatePhotoDto } from "src/photo/dto/create-photo.dto";

export class CreateTeamDto {
  name: string;
  number: number;
  modality: string;
  photo: CreatePhotoDto | undefined;
}
