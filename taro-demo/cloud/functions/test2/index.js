// 这个云函数从知乎提取数据

const request = require('request')
const cheerio = require('cheerio')

async function main (event) {
  console.log(event)
  console.log(request)

  const { a } = event
  return new Promise((resolve, reject) => {

    request({
      url: 'https://www.zhihu.com/',
    }, (err, resp) => {

      var $ = cheerio.load(resp.body)
      var titles = []
      $('[data-za-detail-view-element_name="Title"]').each(function() {
        titles.push($(this).text())
        
      })

      resolve({
        openid: context.userInfo.openId,
        titles,
        a
      })
    })

  })

}

exports.main = main
