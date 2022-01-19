run:

release:
	rm -rf public/*
	mkdir -p public/res/css
	cp res/css/app.min.css public/res/css/app.css
	cp res/css/spectre.min.css public/res/css/
	cp res/css/spectre-exp.min.css public/res/css/
	cp res/css/spectre-icons.min.css public/res/css/
	mkdir -p public/res/
	cp -r res/image public/res/
	mkdir -p public/res/js/
	cp res/js/app.min.js public/res/js/app.js
	
	# html
	cp index.min.html public/index.html
	cp favicon.ico public/favicon.ico
	cp download.min.html public/download.html
	cp contact.min.html public/contact.html
	cp price.min.html public/price.html
	cp pay.min.html public/pay.html
	cp privacy.min.html public/privacy.html
	cp privacy_zh.min.html public/privacy_zh.html
	cp privacy.txt public/privacy.txt
