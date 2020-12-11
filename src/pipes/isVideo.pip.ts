import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'isimage'})
export class IsImagePipe implements PipeTransform{
    transform(value: string):boolean {
        let imageExtensions = [".mp4",".mkv"];
        for (let ext of imageExtensions) {
            if(value && value.includes(ext))
                return true;
        }return false;
    }

}