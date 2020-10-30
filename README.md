# scaffold-vue-firebase-tailwind

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

SIGUE ESTOS PASOS EN ORDEN! PARA NO PERDER TIEMPO

1 Crear un nuevo repositorio en github online sin readme

2 Desde la terminal 
	No uses el mouse, usa ctrl+c ctrl+v; 
	Selección manual>Choose version,Babel,Router,Linter/formatter
	vue3
	history Mode: Y
	ESlint with error prevention only
	Lint on save, lint and fix on commit
	Dedicated config files
	Save config: Y
	
#INSTALA DE FORMA GLOBAL O ACTUALIZA
npm i -g node@lts
npm i -g @vue/cli

#VUEJS
vue create scaffold-vue-firebase-tailwind
cd scaffold-vue-firebase-tailwind

#Borra archivos que no necesitamos
rd .\src\views\About.vue
rd .\src\components\HelloWorld.vue
rd .\src\assets\logo.png

#TAILWIND: hay que pegar los archivos de la carpeta
npm install tailwindcss
npx tailwindcss init
npm install @fullhuman/postcss-purgecss --save-dev

#FIREBASE: Hay que pegar y reemplazar el main.js y el home
npm install --save firebase

#GITHUB
git init
git remote add origin git@github.com:Djarrieta/scaffold-vue-firebase-tailwind.git
git branch -M master
git add .
git commit -m "init"
git pull origin master --allow-unrelated-histories
git push -u origin master

