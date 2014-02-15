module.exports = (grunt) ->

  require("load-grunt-tasks") grunt

  require("time-grunt") grunt


  grunt.initConfig
    bopit:

      app:   "client"
      srv:   "server"

      tmp:   ".tmp"
      dist:  "public"


    express:
      options:
        cmd: "coffee"

      dev:
        options:
          script: "bopit.coffee"
          node_env: "development"
          port: process.env.PORT or 8000

      prod:
        options:
          script: "bopit.coffee"
          node_env: "production"
          port: process.env.PORT or 80


    prettify:
      dist:
        expand: true
        cwd:  "<%= bopit.dist %>"
        src:  "**/*.html"
        dest: "<%= bopit.dist %>"

    watch:
      views_templates:
        files: [
          "<%= bopit.app %>/**/*.jade",
          "!<%= bopit.app %>/index.jade"
        ]
        tasks: [ "newer:jade:templates" ]
      views_index:
        files: [ "<%= bopit.app %>/index.jade" ]
        tasks: [ "newer:jade:index" ]

      scripts:
        files: ["<%= bopit.app %>/**/*.coffee"]
        tasks: ["newer:coffee:dist"]

      styles:
        files: ["<%= bopit.app %>/**/*.sass"]
        tasks: [ "compass:dev", "autoprefixer" ]

      livereload_css:
        options: livereload: true
        files: [ "<%= bopit.tmp %>/**/*.css" ]

      livereload_else:
        options: livereload: true
        files: [
          "<%= bopit.dist %>/index.html"
          "<%= bopit.tmp %>/**/*.html"
          "<%= bopit.tmp %>/**/*.js"
        ]

      livereload_js:
        options: livereload: true
        files: [ "<%= bopit.app %>/**/*.js" ]

      express:
        files: [ "<%= bopit.srv %>/**/*.coffee", "bopit.coffee" ]
        tasks: ["express:dev"]
        options:
          nospawn: true

      css:
        files: ["<%= bopit.app %>/**/*.css"]
        tasks: [ "newer:copy:styles_tmp", "autoprefixer" ]

      gruntfile: files: ["Gruntfile.{js,coffee}"]


    clean:
      dist:
        files: [
          dot: true
          src: [
            "<%= bopit.tmp %>/*"
            "<%= bopit.dist %>/*"
          ]
        ]


    jade:
      index:
        expand: true
        cwd:    "<%= bopit.app %>"
        src:    [ "index.jade" ]
        dest:   "<%= bopit.dist %>"
        ext:    ".html"
      templates:
        expand: true
        cwd:    "<%= bopit.app %>"
        src:    [ "**/*.jade", "!index.jade" ]
        dest:   "<%= bopit.tmp %>"
        ext:    ".html"


    autoprefixer:
      options: browsers: ["last 1 version"]
      dist:
        expand: true
        cwd:    "<%= bopit.tmp %>"
        src:    [ "**/*.css" ]
        dest:   "<%= bopit.tmp %>"


    coffee:
      dist:
        options: sourceMap: false
        files: [
          expand: true
          cwd:  "<%= bopit.app %>"
          src:  "**/*.coffee"
          dest: "<%= bopit.tmp %>"
          ext: ".js"
        ]
      dev:
        options:
          sourceMap: true
          sourceRoot: ""
        files: "<%= coffee.dist.files %>"


    compass:
      options:
        sassDir:                 "<%= bopit.app %>"
        cssDir:                  "<%= bopit.tmp %>"
        imagesDir:               "<%= bopit.app %>"
        javascriptsDir:          "<%= bopit.app %>"
        fontsDir:                "<%= bopit.app %>"
        importPath:              "components"
        httpImagesPath:          "/images"
        httpFontsPath:           "/fonts"
        relativeAssets:          false
        assetCacheBuster:        false

      prod: options: debugInfo: false
      dev:  options: debugInfo: true
      watch:
        debugInfo: false
        watch:     true


    rev:
      dist:
        src: [
          "<%= bopit.dist %>/**/*.js"
          "<%= bopit.dist %>/**/*.css"
          "<%= bopit.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}"
          "!<%= bopit.dist %>/**/opengraph.png"
        ]


    useminPrepare:
      options: dest: "public"
      html: "<%= bopit.dist %>/index.html"


    usemin:
      options: assetsDirs: "<%= bopit.dist %>"
      html: [ "<%= bopit.dist %>/**/*.html" ]
      css:  [ "<%= bopit.dist %>/**/*.css" ]


    usebanner:
      options:
        position: "top"
        banner: require "./ascii"
      files:  [ "<%= bopit.dist %>/index.html" ]


    ngmin:
      dist:
        expand: true
        cwd:  "<%= bopit.tmp %>"
        src:  "**/*.js"
        dest: "<%= bopit.tmp %>"


    copy:
      styles_tmp:
        expand: true
        cwd:  "<%= bopit.app %>"
        src:  "**/*.css"
        dest: "<%= bopit.tmp %>"
      components_dist:
        expand: true
        src:  [ "components/**" ]
        dest: "<%= bopit.dist %>"
      app_dist:
        expand: true
        cwd: "<%= bopit.app %>"
        dest: "<%= bopit.dist %>"
        src: [
          "*.{ico,txt}"
          "images/**/*"
          "fonts/**/*"
        ]


    inject:
      googleAnalytics:
        scriptSrc: "<%= bopit.tmp %>/ga.js"
        files:
          "<%= bopit.dist %>/index.html": "<%= bopit.dist %>/index.html"


    concurrent:
      dist1_dev: [
        "compass:dev"
        "coffee:dev"
        "copy:styles_tmp"
      ]
      dist1: [
        "jade"
        "compass:prod"
        "coffee:dist"
        "copy:styles_tmp"
      ]
      dist2: [
        "ngmin"
        "autoprefixer"
      ]
      dist3: [
        "copy:app_dist"
        "copy:components_dist"
        "inject:googleAnalytics"
      ]
      watch:
        options: logConcurrentOutput: true
        tasks: [
          "watch"
          "compass:watch"
        ]


    ngtemplates:
      bopit:
        cwd:  "<%= bopit.tmp %>"
        src:  [ "**/*.html", "!index.html" ]
        dest: "<%= bopit.dist %>/scripts/templates.js"
        options:
          usemin: "scripts/main.js"



  grunt.registerTask "build", [
    "clean"

    "jade"
    "concurrent:dist1"

    "prettify"
    "useminPrepare"

    "concurrent:dist2"

    "ngtemplates"
    "concat:generated"

    "cssmin:generated"
    "uglify:generated"

    "usemin"

    "concurrent:dist3"
    "usebanner"
  ]


  grunt.registerTask "express-keepalive", -> @async()


  grunt.registerTask "serve", (target) ->
    if target is "dist"
      return grunt.task.run [
        "build"
        "express:prod"
        "express-keepalive"
      ]
    else
      return grunt.task.run [
        "clean"

        "jade"
        "concurrent:dist1_dev"

        "prettify"

        "autoprefixer"
        "useminPrepare"

        "concurrent:dist2"

        "express:dev"

        "concurrent:watch"
      ]


  grunt.registerTask "default", [
    "build"
  ]

