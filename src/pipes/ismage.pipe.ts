import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'fileType'})
export class FileTypePipe implements PipeTransform{
    transform(value: string):string {
        if(!value)return 'none';
        let imageExtensions = [".jpg",".png",".jpeg"];
        for (let ext of imageExtensions) {
            if(value && value.includes(ext))
                return 'image';
        }
        return 'file';
    }

}