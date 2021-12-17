const Repository = require('../models/repository');
const NewsRepository = require('../models/newsRepository');
const News = require('../models/news');
module.exports = 
class NewsController extends require('./Controller') {
    constructor(req, res, params){
        super(req, res, params,  false /* needAuthorization */);
        this.newsRepository = new NewsRepository(req);
    }
   
    head() {
        this.response.JSON(null, this.newsRepository.ETag);
    }
// module.exports =
//     class NewsController extends require('./Controller') {
//         constructor(req, res, params) {
//             super(req, res, params, false /* needAuthorization */);
//             this.newsRepository = new Repository('News', true /* cached */);
//             this.newsRepository.setBindExtraDataMethod(this.resolveUserName);
//         }
        
//         resolveUserName(news) {
//             let users = new Repository('Users');
//             let user = users.get(news.UserId);
//             let username = "unknown";
//             if (user !== null)
//                 username = user.Name;
//             let newsWithUsername = { ...news };
//             newsWithUsername["Username"] = username;
//             return newsWithUsername;
//         }

//         head() {
//             console.log("News ETag request:", this.newsRepository.ETag);
//             this.response.ETag(this.newsRepository.ETag);
//         }

        // GET: api/news
        // GET: api/news?sort=key&key=value....
        // GET: api/news/{id}



        get(id){
            // if we have no parameter, expose the list of possible query strings
            if (this.params === null) { 
                if(!isNaN(id)) {
                    this.response.JSON(this.newsRepository.get(id));
                }
                else  
                    this.response.JSON( this.newsRepository.getAll(), 
                                        this.newsRepository.ETag);
            }
            else {
                if (Object.keys(this.params).length === 0) /* ? only */{
                    this.queryStringHelp();
                } else {
                    this.response.JSON(this.newsRepository.getAll(this.params), this.newsRepository.ETag);
                }
            }
        }
        post(news){  
            if (this.requestActionAuthorized()) {
                let newNews = this.newsRepository.add(news);
                if (newNews)
                    this.response.created(newNews);
                else
                    this.response.unprocessable();
            } else 
                this.response.unAuthorized();
        }
        put(news){
            if (this.requestActionAuthorized()) {
                if (this.newsRepository.update(news))
                    this.response.ok();
                else
                    this.response.unprocessable();
            } else
                this.response.unAuthorized();
        }
        remove(id){
            if (this.requestActionAuthorized()) {
                if (this.newsRepository.remove(id))
                    this.response.accepted();
                else
                    this.response.notFound();
            } else
                this.response.unAuthorized();
        }






        // get(id) {
        //     if (this.params) {
        //         if (Object.keys(this.params).length > 0) {
        //             this.response.JSON(this.newsRepository.getAll(this.params), this.newsRepository.ETag);
        //         } else {
        //             this.queryStringHelp();
        //         }
        //     }
        //     else {
        //         if (!isNaN(id)) {
        //             this.response.JSON(this.newsRepository.get(id));
        //         }
        //         else {
        //             this.response.JSON(this.newsRepository.getAll(), this.newsRepository.ETag);
        //         }
        //     }
        // }
        // post(news) {
        //     if (this.requestActionAuthorized()) {
        //         // validate news before insertion
        //         if (News.valid(news)) {
        //             // avoid duplicate names
        //             if (this.newsRepository.findByField('Name', news.Name) !== null) {
        //                 this.response.conflict();
        //             } else {
        //                 let newNews = this.newsRepository.add(news);
        //                 if (newNews)
        //                     this.response.created(newNews);
        //                 else
        //                     this.response.internalError();
        //             }
        //         } else
        //             this.response.unprocessable();
        //     } else
        //         this.response.unAuthorized();
        // }
        // // PUT: api/news body payload[{"Id":..., "Name": "...", "Url": "...", "Category": "...", "UserId": ..}]
        // put(news) {
        //     if (this.requestActionAuthorized()) {
        //         // validate bookmark before updating
        //         if (News.valid(news)) {
        //             let foundNews = this.newsRepository.findByField('Name', news.Name);
        //             if (foundNews != null) {
        //                 if (foundNews.Id != news.Id) {
        //                     this.response.conflict();
        //                     return;
        //                 }
        //             }
        //             if (this.newsRepository.update(news))
        //                 this.response.ok();
        //             else
        //                 this.response.notFound();
        //         } else
        //             this.response.unprocessable();
        //     } else
        //         this.response.unAuthorized();
        // }
        // // DELETE: api/news/{id}
        // remove(id) {
        //     if (this.requestActionAuthorized()) {
        //         if (this.newsRepository.remove(id))
        //             this.response.accepted();
        //         else
        //             this.response.notFound();
        //     } else
        //         this.response.unAuthorized();
        // }
    }