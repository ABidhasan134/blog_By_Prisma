type IOption={
    page?: string | number,
    limit?:string | number,
    sortBy?: string,
    sortOrder?: string
}
type IOptionReturn={
    page:number,
    limit: number,
    skip:number,
    sortBy: string,
    sortOrder:string
}
const sortingAndPagination=(options:IOption):IOptionReturn=>{
    const page:number= Number(options.page) || 1;
    const limit:number=Number(options.limit) || 5;
    const skip=(page-1)*limit;
    const sortBy:string=options.sortBy || 'title';
    const sortOrder:string=options.sortOrder || 'asc'

    console.log("Ipotion is",options)
    return {page,limit,skip,sortBy,sortOrder}
}
export default sortingAndPagination;