'use strict'

const spawn = require('child_process').spawn
const kgo = require('kgo')
const json2md = require('json2md')
const debug = require('debug')('npm setup')
const fs = require('fs-extra')
const path = require('path')

module.exports = function(settings, cb){

  kgo('npm', function (done) {
    let npmCL = spawn('npm', ['init'], { stdio: 'inherit' })

    npmCL.on('close', function (error, data) {
      done(error,data)
    })
  })
  ('md', ['npm'], function (npm, done) {
    debug('Creating Markdown')
    var pack = require( path.join(settings.packageDir, '/package.json') )
    var mdob = [
      { h1: pack.name },
      { blockquote: pack.description },
      { h1: 'Authors'},
      { ul: [pack.author]}
    ]
    done(null, json2md(mdob))
  })
  ('write', ['md'], function (md, done) {
    debug('Writing Markdown to README.md')
    fs.writeFile('README.md', md, function (error) {
      if (error) done(error)
      done(null,'npm initiated')
    })
  })
  (['*','write'],cb)
}
