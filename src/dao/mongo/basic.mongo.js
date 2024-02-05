export class BasicMongo {
    constructor (model, populateOption) {
        this.model = model;
        this.populateOption = populateOption;
    };

    async findAll() {
        return this.model.find().populate(this.populateOption);
    };

    async findById(id){
        return this.model.findById(id).populate(this.populateOption);
    };

    async createOne(obj) {
        return this.model.create(obj);
    };

    async updateOne(id, obj) {
        return this.model.updateOne({_id:id}, obj);
    };

    async findAndUpdateOne(id, obj) {
        return this.model.findByIdAndUpdate({_id:id}, obj, {new:true});
    };

    async deleteOne(id){
        return this.model.deleteOne({_id:id});
    };
    
    async findAndDeleteOne(id){
        return this.model.findByIdAndDelete({_id:id});
    };
}