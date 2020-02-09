'use strict';

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: {
      author: 'author-size-',
      tag: 'tag-size-',
    },
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      activeTags: 'a.active[href^="#tag-"]',
      activeAuthors: 'a.active[href^="#author-"]',
    },
  },
  article: {
    posts: '.post-title',
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: 'authors.list',
  }
};

////////////////////////////////////////////////////////////

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

////////////////////////////////////////////////////////////

function generateTitleLinks(customSelector = ''){

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
  /* [DONE] for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  let html = '';
  for(let article of articles){

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE] find the title element & get the title from the title element*/
    const articleTitle = article.querySelector(select.article.posts).innerHTML;

    /* [DONE] create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* [DONE] insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

////////////////////////////////////////////////////////////

function calculateParams(tags){
  const params = {
    max: 0,
    min: 999999
  };
  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

////////////////////////////////////////////////////////////

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
  return opts.tagSizes.classPrefix.tag + classNumber;
}

////////////////////////////////////////////////////////////

function generateTags(){
  /* [NEW] create new variable allTags with an empty object */
  let allTags = {};
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* [DONE] START LOOP: for every article: */
  for(let article of articles){
    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(select.article.tags);
    /* [DONE] make html variable with empty string */
    let html = '';
    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* [DONE] START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* [DONE] generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* [DONE] add generated code to html variable */
      html = html + tagHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* [DONE] END LOOP: for each tag */
    }
    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    const tags = document.querySelectorAll('.post-tags ul li a');

    for(let tag of tags){
      tag.addEventListener('click', tagClickHandler);
    }
  /* [DONE] END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateParams(allTags);
  //console.log('tagsParams:', tagsParams);
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTagsHtml to tagList */
  tagList.innerHTML = allTagsHTML;

  const tags = document.querySelectorAll('.tags li a');
  for(let tag of tags){
    tag.addEventListener('click', tagClickHandler);
  }
}

generateTags();

////////////////////////////////////////////////////////////

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(clickedElement);
  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* [DONE] find all tag links with class active */
  const tagLinks = document.querySelectorAll(select.all.linksTo.activeTags);
  /* [DONE] START LOOP: for each active tag link */
  for(let tagLink of tagLinks){
    /* [DONE] remove class active */
    tagLink.classList.remove('active');
  /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* [DONE] START LOOP: for each found tag link */
  for(let hrefTagLink of hrefTagLinks){
    /* [DONE] add class active */
    //console.log(hrefTagLink);
    hrefTagLink.classList.add('active');
  /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

////////////////////////////////////////////////////////////

function calculateAuthorClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
  return opts.tagSizes.classPrefix.author + classNumber;
}

////////////////////////////////////////////////////////////

function generateAuthors() {
  /* [NEW] create new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find author wrapper */
    const authorWrapper = article.querySelector(select.article.author);
    /* make html variable with empty string */
    let html = '';
    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');
    /* generate HTML of the link */
    const authorHTML = 'by <a href="#author-' + author + '">' + author + '</a>'
    /* add generated code to html variable */
    html = html + authorHTML;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(author)){
      /* [NEW] add author to allAuthors object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    /* insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector('.authors');
  /* [NEW] create variable for all links HTML code */
  const authorParams = calculateParams(allAuthors);
  let allAuthorsHTML = '';
  /* [NEW] START LOOP: for each author in allAuthors: */
  console.log(allAuthors);
  for(let author in allAuthors){
    /* [NEW] generate code of a link and add it to allAuthorsHTML */
    allAuthorsHTML += '<li><a href="#author-' + author + '" class="' + calculateAuthorClass(allAuthors[author], authorParams) + '">' + author + '</a></li>';
  /* [NEW] END LOOP: for each author in allAuthors: */
  }
  /* [NEW] add html from allAuthorsHtml to authorList */
  authorList.innerHTML = allAuthorsHTML;

  const authors = document.querySelectorAll('.authors li a, .post-author a');
  for(let author of authors){
    author.addEventListener('click', authorClickHandler);
  }
}

generateAuthors();

////////////////////////////////////////////////////////////

function authorClickHandler(event) {
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* [DONE] make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* [DONE] find all author links with class active */
  const authorLinks = document.querySelectorAll(select.all.linksTo.activeAuthors);
  /* [DONE] START LOOP: for each active author link */
  for(let authorLink of authorLinks){
    /* [DONE] remove class active */
    authorLink.classList.remove('active');
  /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all author links with "href" attribute equal to the "href" constant */
  const hrefAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* [DONE] START LOOP: for each found author link */
  for(let hrefAuthorLink of hrefAuthorLinks){
    /* [DONE] add class active */
    hrefAuthorLink.classList.add('active');
  /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}
