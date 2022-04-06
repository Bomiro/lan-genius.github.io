run:

release:
	mv index.min.html docs/index.html
	mv res/css/app.min.css docs/res/css/app.css
	cp -r res/image/* docs/res/image/
	mv contact.min.html docs/contact.html
	