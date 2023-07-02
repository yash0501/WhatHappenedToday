import {NearBindgen, call, view, near, LookupMap, assert} from "near-sdk-js";
import { AccountId } from 'near-sdk-js/lib/types'

class NewsArticle {
  id : number;
  uri : string;
  category : string;
  author : string;
  authorId : string;
  tags : string;
  publishedOn : string;
  publishedUnder : string;
  
  constructor (id : number, uri : string, category : string, author : string, authorId : AccountId, tags : string, publishedOn : string, publishedUnder : string){
    this.id = id;
    this.uri = uri;
    this.category = category;
    this.author = author;
    this.authorId = authorId;
    this.tags = tags;
    this.publishedOn = publishedOn;
    this.publishedOn = publishedUnder;
  }
}

@NearBindgen({})
class WhatHappenedToday {
  newsArticles : LookupMap<NewsArticle>;
  owner : AccountId
  articlesCount : number

  constructor(){
    this.owner = near.signerAccountId()
    this.articlesCount = 0
  }

  // @view({}) // This method is read-only and can be called for free
  // get_greeting() {
  //   return this.greeting;
  // }

  @call({}) // This method changes the state, for which it cost gas
  add_article({ uri, category, author, tags, authorId,  publishedUnder, publishedOn }: {
    uri : string,
    category : string,
    author : string,
    tags : string,
    authorId : string,
    publishedUnder : string,
    publishedOn : string
  }){
    let id  = this.articlesCount
    let idString = id.toString()
    let newArticle = new NewsArticle(id, uri, category, author, authorId, tags, publishedOn, publishedUnder)
    this.newsArticles.set(idString, newArticle)
    this.articlesCount += 1

  }

  @call({})
  update_article({ id, uri, category, author, tags, authorId,  publishedUnder, publishedOn }: {
    id : number,
    uri : string,
    category : string,
    author : string,
    tags : string,
    authorId : string,
    publishedUnder : string,
    publishedOn : string
  }){
    assert(id>this.articlesCount, "Article does not exist")
    let idString = id.toString()
    // assert(this.newsArticles.get(idString).authorId==near.signerAccountId, "Sender is not author")
    this.newsArticles[idString].set(uri, uri)
    this.newsArticles[idString].set(category, category)
    this.newsArticles[idString].set(author, author)
    this.newsArticles[idString].set(tags, tags)
    this.newsArticles[idString].set(publishedOn, publishedOn)
    this.newsArticles[idString].set(publishedUnder, publishedUnder)
  }

  @call({})
  delete_article({id} : {id : number}){
    assert(id>this.articlesCount, "Article does not exist")
    let idString = id.toString()
    this.newsArticles.remove(idString)
  }

  @view({})
  getArticle({id} : {id : number}) : NewsArticle {
    assert(id>this.articlesCount, "Article does not exist")
    let idString = id.toString()
    return this.newsArticles.get(idString)
  }

  @view({})
  getArticlesCount() : number {
    return this.articlesCount
  }

  @view({})
  getArticles() :  LookupMap<NewsArticle> {
    return this.newsArticles
  }

  // @view({})
  // getArticlesByAuthor({author} : {author : string}) : LookupMap<NewsArticle> {
    
  //   return
  // }
}
