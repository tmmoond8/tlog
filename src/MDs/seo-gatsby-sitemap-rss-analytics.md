---
title: Gatsby - SEO sitemap, rss, analytics 적용
date: '2019-12-18T04:13:29.424Z'
description: Gatsby로 만든 블로그에서 어떻게 SEO 를 설정할까?
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/gatsby_zucriz.jpg'
tags:
  - Gatsby
---


gatsby에는 정말 유용한 툴들이 많은데,, sitemap, rss, analytics를 적용해보자.

일단 플러그인으로 모두 제공하니 설치하자.
```bash
$ yarn add gatsby-plugin-sitemap gatsby-plugin-feed gatsby-plugin-google-anaytics --dev
```

## sitemap

먼저 sitemap을 먼저 보자. siteUrl을 기본으로 page의 path를 가져와서 sitemap을 만들어 낸다.

```js
siteMetadata: {
    ...
    siteUrl: `https://tlog.tammolo.com`
  },
  plugins: [
    ...
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: `/sitemap.xml`,
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            
            allSitePage {
              edges {
                node {
                  path
                }
              }
            }
          }
        `
      }
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
  ...
```

yarn dev로 실행했을 때는 이 부분은 돌지 않고, yarn build를 돌려야 sitemap을 생성한다.

    $ yarn build && yarn serve

[http://localhost:9000/sitemap.xml](http://localhost:9000/sitemap.xml)  에 접속하면 xml이 생긴것을 확인할 수 있다.

## rss

이어서 비슷하게 rss도 적용해보자.

```js
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Your Site's RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
          },
        ],
      },
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
  ...
```

마찬가지로 빌드 하면 rss 파일이 생성된다.
```bash
$ yarn build && yarn serve
```

[http://localhost:9000/rss.xml](http://localhost:9000/rss.xml) 에 접속하면 생성된 rss을 볼 수 있다.

## google-analytics

이건 제대로 적용이 되는 건지 잘 모르겠지만,, 일단 설정해보자. 나 같은 경우는 tackingId만 google analytics에서 가져왔는데, 필요하다면 여러 옵션을 더 달아주는 거 같다.

```js
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-141390268-1"
      }
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
  ...
```

## google search console

위에서 나의 블로그쪽에서 설정을 했다면 [https://search.google.com/search-console/about](https://search.google.com/search-console/about) 들어가서 등록을 해줘야 한다.

URL 접두어로 내 사이트를 등록하고 HTML meta 태그를 추가하라고 나온다. 이 내용을 내 react-helmet으로 추가 해줘야 한다. 진작에 THelmet으로 별도 컴포넌트 만들어서 관리하도록 해서 이런 추가 태그도 넣기가 쉬웠다. 먼저 프로젝트에서 적용한 후 Netlify 에 배포 한 다음에 확인을 눌러야 진행이 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952584/tlog/aa_ipkoce.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952590/tlog/bb_erhwrl.png)

google search console 메뉴를 보면 

Sitemaps 라는 탭을 들어가서 내 sitemap.xml을 등록한다. 아래 화면을 보면 상태가 성공으로 되어 있지만, 처음 올리면 '확인되지 않음?' 이런 값으로 나온다. 이때는 URL 검사 탭에서 URL 검사를 해주면 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-05__4.39.37_lahuhj.png)

URL 검사에 내 sitemap.xml 의 주소를 넣어준다. 그리고 색인 생성 요청을 누른다. 색인이 생성되면 Sitemap의 상태가 성공으로 바뀔 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-05__4.39.22_abzlbz.png)