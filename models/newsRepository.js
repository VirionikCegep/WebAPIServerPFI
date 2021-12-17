const Repository = require('./repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const News = require('./news.js');
const utilities = require("../utilities");
module.exports = 
class NewsRepository extends Repository {
    constructor(req){
        super('News', true);
        this.users = new Repository('Users');
        this.req = req;
        this.setBindExtraDataMethod(this.bindUsernameAndImageURL);
    }
    bindUsernameAndImageURL(news){
        if (news) {
            let user = this.users.get(news.UserId);
            let username = "unknown";
            let Avatar = "";
            if (user !== null)
            {
                username = user.Name;
                Avatar = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
            }
            let bindedNews = {...news};
            bindedNews["Username"] = username;
            bindedNews["Avatar"] = Avatar;
            bindedNews["Date"] = utilities.secondsToDateString(news["Created"]);
            if (news["GUID"] != ""){
                bindedNews["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(news["GUID"]);
                bindedNews["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(news["GUID"]);
            } else {
                bindedNews["OriginalURL"] = "";
                bindedNews["ThumbnailURL"] = "";
            }
            return bindedNews;
        }
        return null;
    }
    add(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.valid(news)) {
            news["GUID"] = ImageFilesRepository.storeImageData("", news["ImageData"]);
            delete news["ImageData"];
            return super.add(news);
        }
        return null;
    }
    update(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.valid(news)) {
            let foundNews = super.get(news.Id);
            if (foundNews != null) {
                news["GUID"] = ImageFilesRepository.storeImageData(news["GUID"], news["ImageData"]);
                delete news["ImageData"];
                return super.update(news);
            }
        }
        return false;
    }
    remove(id){
        let foundNews = super.get(id);
        if (foundNews) {
            ImageFilesRepository.removeImageFile(foundNews["GUID"]);
            return super.remove(id);
        }
        return false;
    }
}