

let mainMenuListenerObject = { //считывания кликов по меню
	mainMenuListener : function(e){
		switch(e.target.id){
			case 'menuSwitcher' :
				mainMenu.classList.toggle('menu_transform');
			break;
			case 'settingsBtn':
			c('!');
				setMenu.classList.toggle('switch_semi_wid');
				authorMenu.classList.remove('switch_semi_wid');
			break;
			case 'authorBtn':
			c('!');
				authorMenu.classList.toggle('switch_semi_wid');
				setMenu.classList.remove('switch_semi_wid');
			break;
			case 'incCoinsCost':
				if(mainVars.mainBank > mainVars.coinCostUpgCost && mainVars.coinCostUpgCost < 10000){
					mainVars.mainBank = mainVars.mainBank - mainVars.coinCostUpgCost;
					mainVars.coinCostUpgCost = mainVars.coinCostUpgCost * 1.2;
					mainVars.coinCost = mainVars.coinCost * 1.2
					gameplay.updateBank()
					coinCostLvl.textContent = `стоимость:${Math.round(mainVars.coinCostUpgCost)}`; 
				}
			break;
			case 'incSpawnChanse':
				if(mainVars.mainBank > mainVars.SpawnChanseCost && mainVars.bigCoinChanse > 5){
					mainVars.mainBank = mainVars.mainBank - mainVars.SpawnChanseCost;
					mainVars.SpawnChanseCost = mainVars.SpawnChanseCost * 1.5;
					mainVars.bigCoinChanse = mainVars.bigCoinChanse - 1;
					gameplay.updateBank()
					spawnChanseLvl.textContent = `стоимость:${Math.round(mainVars.SpawnChanseCost)}`;
				}
			break;
			case 'spawnRateLvl':
				if(mainVars.mainBank > mainVars.bonusCoinUpgCost && mainVars.bonusCoinSpawnRate >= 5000){
					mainVars.mainBank = mainVars.mainBank - mainVars.bonusCoinUpgCost;
					mainVars.bonusCoinUpgCost = mainVars.bonusCoinUpgCost * 1.5;
					mainVars.bonusCoinSpawnRate = mainVars.bonusCoinSpawnRate - 1000;
					gameplay.updateBank();
					incRateLvl.textContent = `стоимость:${Math.round(mainVars.bonusCoinUpgCost)}`;
				}	
			break;
				
		}
	},
	removeAllMenu : function(e){
		if(e.target.tagName == 'BODY'){
			c('скрыть меню');
			mainMenu.classList.add('menu_transform');
			setMenu.classList.remove('switch_semi_wid');
			authorMenu.classList.remove('switch_semi_wid');
		}
	},
}

let gameplay = { //игровая часть, создание и удаление монет, визуал и просто куча всего , по тому что я тупанул 

	addCoin: function(e){ // добавление монетки под курсор
		const coin = coins.content.children[0].cloneNode(true);
		const bankValue = coins.content.children[1].cloneNode(true);

		bankValue.innerHTML = `<span>+${Math.round(mainVars.coinCost)}</span>`	//вставляем число стоимости монеты и пополняем банк
		mainVars.mainBank += mainVars.coinCost

			gameplay.setCoinPos(e,bankValue)

			gameplay.setCoinAnim(coin)
			gameplay.setCoinPos(e,coin)

			moneyBag.append(coin)
			moneyBag.append(bankValue)

			setTimeout(removeGameFieldItems,800)

		function removeGameFieldItems(){
				coin.remove()
				bankValue.remove()
		}

		localStorage.setItem('coins',mainVars.mainBank);	//обновляем локальное хранилище

		let bigCoinChanse = rnd(0,50);	//ШАНС ВЫПАДЕНИЯ БОЛЬШОЙ МОНЕТЫ

		if(bigCoinChanse >= mainVars.bigCoinChanse){
			let bigcoin = new bonusBigCoin();

			bigcoin.elem.style.left = `450px`
			bigcoin.elem.style.top = `200px`


			let i = rnd(0,3);

			if(i == 1){
				bigcoin.elem.style.animation = 'bigCoinTransform 2.5s forwards linear'
			}else{
				bigcoin.elem.style.animation = 'bigCoinTransform2 2.5s forwards linear'
			}

			bigcoin.elem.addEventListener('click',gameplay.removeAndBonus);

			gameField.append(bigcoin.elem)

		}

		gameplay.updateBank()



	},

	removeAndBonus: function(e){
		e.target.style.opacity = '0';
		e.target.style.position = 'reletive';
		e.target.style.top = '-20px';
		e.target.style.pointerEvents = 'none';

		mainVars.mainBank =  mainVars.mainBank + mainVars.coinCost * mainVars.bigCoinCost

		setTimeout(removeE,300);

		function removeE(){
			e.target.remove()
		}
		gameplay.updateBank()
	},

	setCoinPos: function(e,coinElem){//установка монетки под курсор

		coinElem.style.top = `${e.offsetY - 25}px`;
		coinElem.style.left = `${e.offsetX - 25}px`;

	},

	setCoinAnim: function(elem){//установка анимации падения монеты
		let i = rnd(1,4);

		switch(i){
			case 1:
				elem.style.animationName = 'coinFlipOne'
			break;
			case 2:
				elem.style.animationName = 'coinFlipTwo'
			break;
			case 3:
				elem.style.animationName = 'coinFlipThree'
			break;
		}
	},

	updateBank: function(){
		bank.innerHTML = `<span>${Math.round(mainVars.mainBank)}</span>`
	},
}

let mainVars = {	//переменные 
	//главное хранилище монет
	mainBank : this.mainBank=+localStorage.getItem('coins'),
	//игровое поле хранилище монет
	generatorsBank : null,
	//кол-во генераторов на игровом поле
	generatorsValue : null,
	//=====стоимость одной монеты
	coinCost : 1,
	//=====скорость спауна монет
	spawnSpeed : null,
	//-----стоимость улучшения скорости спауна
	spawnSpeedUpgCost : null,
	//-----стоимость улучшения стоимости монет
	coinCostUpgCost : 10,
	//-----стоимость покупки нового генератора
	SpawnChanseCost : 100,
	//-----интервал появления
	spawnInterval : 5000,
	//стоимость большой монеты
	bigCoinCost : 10,
	//шанс большой монеты
	bigCoinChanse : 48,
	//частота появление бонуса
	bonusCoinSpawnRate : 10000 ,
	bonusCoinUpgCost : 1000 ,



}

let MoneyBagAnimations = {
	onBag : function(){
		moneyBag.style.transform = 'scale(1.15)';
	},
	outBag : function(){
		moneyBag.style.transform = 'scale(1)';
	},
	mouseClickOnBag :function(){
		moneyBag.style.transform = 'scale(1.2)';
	},
	mouseClickOutBag :function(){
		moneyBag.style.transform = 'scale(1.15)';
	},
};



class bonusBigCoin{

	constructor(start){
		this.elem = coins.content.children[2].cloneNode(true);
		this.cost = mainVars.coinCost * 10;
	}
}




mainMenu.addEventListener('click',mainMenuListenerObject.mainMenuListener); //читаем события с меню

moneyBag.addEventListener('click',gameplay.addCoin)	//добавление монетки по клику



/*анимации нажатия на мешок денег*/
moneyBag.addEventListener('mouseover',MoneyBagAnimations.onBag)
moneyBag.addEventListener('mouseout',MoneyBagAnimations.outBag)
moneyBag.addEventListener('mousedown',MoneyBagAnimations.mouseClickOnBag)
moneyBag.addEventListener('mouseup',MoneyBagAnimations.mouseClickOutBag)



document.addEventListener('click',mainMenuListenerObject.removeAllMenu); //скрытие всех меню при клике на боди

function saveProgress(){

}

document.addEventListener('unload',saveProgress);


//все что связанно с выводом нужной инфы при перезагрузке
coinCostLvl.textContent = `стоимость:${Math.round(mainVars.coinCostUpgCost)}`;
spawnChanseLvl.textContent = `стоимость:${Math.round(mainVars.SpawnChanseCost)}`;
incRateLvl.textContent = `стоимость:${Math.round(mainVars.bonusCoinUpgCost)}`;
gameplay.updateBank()

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; 
}


function c(text){
	console.log(text);
}


gameField.addEventListener('click',listenerField)

let bonusBigCoinInterval = setInterval(bonusCoinCreate,mainVars.bonusCoinSpawnRate);

function listenerField(e){
	switch(e.target.id){
		case 'bonusBigCoin' :
			kakZheYaZadolbalsaPridumivatNazvaniyaFunkziyam(e.target);
		break;
	}
}

function bonusCoinCreate(){
	let bonusCoin = coins.content.children[2].cloneNode(true);
	bonusCoin.style.left = `${rnd(0,gameField.offsetWidth)}px`
	bonusCoin.style.top = `${rnd(0,gameField.offsetHeight)}px`
	bonusCoin.style.opacity ='0';
	gameField.append(bonusCoin);
	
	setTimeout(()=>{
		bonusCoin.style.opacity = '1';
	},300);
	
}

function kakZheYaZadolbalsaPridumivatNazvaniyaFunkziyam(elem){
	elem.style.opacity = '0';

	mainVars.mainBank = mainVars.mainBank + mainVars.coinCost * 100;
	gameplay.updateBank()

	setTimeout(()=>{
		elem.remove()
	},300);
};
