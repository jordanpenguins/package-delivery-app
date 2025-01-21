export class Package {

    package_title: string;
    package_weight: number;
    package_destination: string;
    description: string;
    isAllocated: boolean;
    driver_id: string;


    constructor() {
        this.package_title = ''
        this.package_weight = 0
        this.package_destination = ''
        this.isAllocated = true
        this.driver_id = ''
        this.description = ''

    }



}