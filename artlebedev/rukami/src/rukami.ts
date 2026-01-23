import { Color, AmbientLight, DirectionalLight, Vector3, NearestFilter } from 'three';
import { Krono } from '../../krono/build/krono.js';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import audioKeyframes from './keyframes/audio';
import distanceKeyframes from './keyframes/distance';
import postKeyframes from './keyframes/post';

function convertCoordinatesBlenderToThree(data) {
  // [data.y, data.z] = [data.z, data.y]
  // data.z *= -1;

  return data;
}

function deg2rad(d: number): number {
  return d * (Math.PI / 180);
}

function colorFromRGB(r, g, b) {
  return new Color(`rgb(${ r }, ${ g }, ${ b })`);
}

function getObjectByMaterialName(obj, name) {
  let result = null;

  obj.traverse(child => {
    if (child.material?.name === name) {
      result = child;

      return;
    }
  });

  return result;
}

function changeVertexColors(geometry, color) {
  const colors = geometry.attributes.color;

  for (let i = 0; i < colors.count; i++) {
    colors.setXYZ(i, color.r, color.g, color.b);
  }

  colors.needsUpdate = true;
}

const answers = {
  '02': [
    'Хидео Кодзима',
    'Марк Цукерберг',
    'Сергей Королёв',
    'Грета Тунберг',
    'Кристофер Нолан',
  ],

  '03': [
    'Лежу на шезлонге, робот подносит мне апельсиновый сок',
    'Мои именем назвали новый вид синтезированных существ',
    'Строю скоростную межгалактическую магистраль',
    'Получаю Нобелевскую премию',
    'Руководителем студии по производству сновидений',
  ],

  '01': [
    'Победа любой ценой',
    'Планета и живой мир',
    'Человечество',
    'Любовь',
    'Шедевр',
  ],

  '04': [
    'Молниеносная реакция',
    'Понимаю животных, а они меня',
    'На «ты» с любым микроконтроллером',
    'Умею совмещать несовместимые вещи',
    'Я — самый креативный среди своих друзей',
  ],

  '05': [
    'Стать кибер-чемпионом',
    'О собственном единороге',
    'О даче на орбите',
    'Изобрести сыворотку гениальности',
    'Визуализировать эмоции людей',
  ],

  '06': [
    'Гонки на дронах',
    'Забег виртуальных питомцев',
    'Межпланетный альпинизм',
    'Киберсадоводство',
    'Серфинг по эпохам'
  ]
};

const questionsData = {
  '02_Hero': 'Кто из героев прошлого для тебя гений?',
  '03_Future': 'Кем ты видишь себя через десять лет?',
  '01_Colorful': 'За что не жалко отдать жизнь?',
  '04_Superpowers': 'В чем твоя суперсила?',
  '05_Dream': 'О чем ты мечтаешь?',
  '06_Olympic': 'Какой спорт будет на Олимпийских играх будущего?'
};

const scenes = {
  hero: {
    percentage: 0.2079601433049709,
    position: convertCoordinatesBlenderToThree({
      x: 17.0,
      y: 56.0,
      z: -47.0,
    }),
    rotation: convertCoordinatesBlenderToThree({
      x: deg2rad(0),
      y: deg2rad(0),
      z: deg2rad(90),
    }),
  },

  future: {
    percentage: 0.31605463502015224,
    position: convertCoordinatesBlenderToThree({
      x: -50.6193,
      y: 55.5133,
      z: -174.715,
    })
  },

  colorful: {
    percentage: 0.5133788625167935,
    position: convertCoordinatesBlenderToThree({
      x: -159.531,
      y: 209.956,
      z: -179.909,
    }),
    rotation: convertCoordinatesBlenderToThree({
      x: deg2rad(0),
      y: deg2rad(0),
      z: deg2rad(-90),
    }),
  },

  superpowers: {
    percentage: 0.7030620241827138,
    position: convertCoordinatesBlenderToThree({
      x: -266.721,
      y: 309.642,
      z: -180.153,
    }),
    rotation: convertCoordinatesBlenderToThree({
      x: deg2rad(0),
      y: deg2rad(0),
      z: deg2rad(90),
    }),
  },

  dream: {
    percentage: 0.8239476041200179,
    position: convertCoordinatesBlenderToThree({
      x: -393.251,
      y: 309.021,
      z: -140.498,
    }),
    rotation: convertCoordinatesBlenderToThree({
      x: deg2rad(0),
      y: deg2rad(0),
      z: deg2rad(90),
    }),
  },

  olympic: {
    percentage: 0.9702754142409314,
    position: convertCoordinatesBlenderToThree({
      x: -656.321,
      y: -464.23,
      z: -152.732,
    }),
    rotation: convertCoordinatesBlenderToThree({
      x: deg2rad(0),
      y: deg2rad(0),
      z: deg2rad(90),
    }),
  }
};

// enter / leave
const answersColors = [
  [colorFromRGB(255, 0, 0), colorFromRGB(0, 0, 0)],
  [colorFromRGB(82, 40, 231), colorFromRGB(240, 94, 43)],
  [colorFromRGB(255, 107, 78), colorFromRGB(142, 222, 12)],
  [colorFromRGB(251, 42, 42), colorFromRGB(0, 182, 121)],
  [colorFromRGB(249, 139, 255), colorFromRGB(0, 243, 255)],
  [colorFromRGB(0, 255, 119), colorFromRGB(255, 255, 62)]
];

class Rukami {
  private krono: Krono;

  public currentAnchor: string;

  private lowQuality: boolean = false;
  private totalResourcesCount: number = 91;

  afterInitStart: any;
  afterSceneLoaded: any;
  _onAnswer: any;
  _onScrollEnd: any;
  private _onProgress: any;

  private canvasContainer: any;
  private scrollContainer: any;
  private scrollMessageElement: any;

  private assetsPath: string;

  private isiOS = !!navigator.userAgent.match(/iPad/i) || !!navigator.userAgent.match(/iPhone/i);
  private isScrollEnd = false;

  // на столько двигать скролл после ответа на вопрос
  private onAnswerPointerUpScrollPercentage = 0.012;
  private iOSScrollY = 0;
  private isScrollDisabled = false;

  private answersToSend = [
    null,
    null,
    null,
    null,
    null,
    null
  ];

  constructor(options = {
    assetsPath: null,
    canvasContainer: null,
    scrollContainer: null,
    scrollMessageElement: null,
    onProgress: null,
    onAnswer: null,
    onScrollEnd: null,
    afterInitStart: null,
    afterSceneLoaded: null
  }) {
    this.afterInitStart = options.afterInitStart;
    this.afterSceneLoaded = options.afterSceneLoaded;

    this.assetsPath = options.assetsPath;

    if (this.afterInitStart) {
      this.afterInitStart();
    }

    let keyframes = [
      distanceKeyframes,
      postKeyframes,
      audioKeyframes(this.assetsPath)
    ];
    
    let audios = [
      this.assetsPath + 'aac/01.m4a',
      this.assetsPath + 'aac/02.m4a',
      this.assetsPath + 'aac/03.m4a',
      this.assetsPath + 'aac/04.m4a',
      this.assetsPath + 'aac/05.m4a',
      this.assetsPath + 'aac/06.m4a',
      this.assetsPath + 'aac/07.m4a'
    ];

    if (location.search.includes('blank')) {
      keyframes = null;
    }

    this.krono = new Krono({
      canvasContainer: options.canvasContainer,
      scrollContainer: options.scrollContainer,
      // msaaAntialias: true,
      // msaaSamples: 2,
      // smaaAntialias: true,
      mainScenePath: this.assetsPath + 'gltf/Camera_animation.glb',
      debug: (location.search.includes('debug')) ? true : false,
      editor: true,
      debugFlightSpeed: 40,
      keyframes: keyframes,
      audios: audios,
      onLoad: this.onLoad.bind(this),
      onProgress: this.onProgress.bind(this),
      chunks: [
        {
          path: this.assetsPath + 'gltf/00_Gate.glb'
        },

        {
          path: this.assetsPath + 'gltf/01_Colorful/01_Colorful.glb',
          position: scenes.colorful.position,
          rotation: scenes.colorful.rotation
        },
        {
          path: this.assetsPath + 'gltf/01_Colorful/01_Colorful_Question.glb',
          position: new Vector3(scenes.colorful.position.x + 0.331, scenes.colorful.position.y, scenes.colorful.position.z),
          rotation: scenes.colorful.rotation,
          name: '01_Colorful_Question'
        },
        {
          path: this.assetsPath + 'gltf/01_Colorful/01_Colorful_Flying_Scene_Characters.glb',
          position: scenes.colorful.position,
          rotation: scenes.colorful.rotation
        },
        {
          path: this.assetsPath + 'gltf/01_Colorful/01_Colorful_Background.glb',
          position: scenes.colorful.position,
          rotation: scenes.colorful.rotation
        },

        {
          path: this.assetsPath + 'gltf/02_Hero/02_Hero.glb',
          position: scenes.hero.position,
          rotation: scenes.hero.rotation
        },
        {
          path: this.assetsPath + 'gltf/02_Hero/02_Hero_Question.glb',
          position: new Vector3(scenes.hero.position.x - 0.5, scenes.hero.position.y, scenes.hero.position.z),
          rotation: scenes.hero.rotation,
          name: '02_Hero_Question'
        },
        {
          path: this.assetsPath + 'gltf/02_Hero/02_Hero_Background.glb',
          position: scenes.hero.position,
          rotation: scenes.hero.rotation
        },

        {
          path: this.assetsPath + 'gltf/03_Future/03_Future.glb',
          position: scenes.future.position
        },
        {
          path: this.assetsPath + 'gltf/03_Future/03_Future_Background.glb',
          position: scenes.future.position
        },
        {
          path: this.assetsPath + 'gltf/03_Future/03_Future_Rigid_Bodies.glb',
          position: scenes.future.position
        },
        {
          path: this.assetsPath + 'gltf/03_Future/03_Future_Question.glb',
          position: new Vector3(scenes.future.position.x, scenes.future.position.y + 0.3, scenes.future.position.z),
          name: '03_Future_Question'
        },
        {
          path: this.assetsPath + 'gltf/03_Future/03_Future_Flying_Scene_Characters.glb',
          position: scenes.future.position
        },

        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Background.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Question.glb',
          position: new Vector3(scenes.superpowers.position.x, scenes.superpowers.position.y - 1, scenes.superpowers.position.z + 1),
          rotation: scenes.superpowers.rotation,
          name: '04_Superpowers_Question'
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Mutations.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Flying_Scene_Characters.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Flowers.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },
        {
          path: this.assetsPath + 'gltf/04_Superpowers/04_Superpowers_Blood_Cells.glb',
          position: scenes.superpowers.position,
          rotation: scenes.superpowers.rotation
        },

        {
          path: this.assetsPath + 'gltf/05_Dream/05_Dream.glb',
          position: scenes.dream.position,
          rotation: scenes.dream.rotation
        },
        {
          path: this.assetsPath + 'gltf/05_Dream/05_Dream_Background.glb',
          position: scenes.dream.position,
          rotation: scenes.dream.rotation
        },
        {
          path: this.assetsPath + 'gltf/05_Dream/05_Dream_Question.glb',
          position: new Vector3(scenes.dream.position.x + 0.9, scenes.dream.position.y + 0.1, scenes.dream.position.z),
          rotation: scenes.dream.rotation,
          name: '05_Dream_Question'
        },

        {
          path: this.assetsPath + 'gltf/06_Olympic/06_Olympic.glb',
          position: scenes.olympic.position,
          rotation: scenes.olympic.rotation
        },

        {
          path: this.assetsPath + 'gltf/06_Olympic/06_Olympic_Background.glb',
          position: scenes.olympic.position,
          rotation: scenes.olympic.rotation
        },
        {
          path: this.assetsPath + 'gltf/06_Olympic/06_Olympic_Scene_Characters.glb',
          position: scenes.olympic.position,
          rotation: scenes.olympic.rotation
        },
        {
          path: this.assetsPath + 'gltf/06_Olympic/06_Olympic_Scene_Ring_Characters.glb',
          position: scenes.olympic.position,
          rotation: scenes.olympic.rotation
        },
        {
          path: this.assetsPath + 'gltf/06_Olympic/06_Olympic_Question.glb',
          position: new Vector3(scenes.olympic.position.x + 2, scenes.olympic.position.y + 0.25, scenes.olympic.position.z),
          rotation: scenes.olympic.rotation,
          name: '06_Olympic_Question'
        }
      ]
    });

    this.canvasContainer = options.canvasContainer;
    this.scrollContainer = options.scrollContainer;
    this.scrollMessageElement = options.scrollMessageElement;
    this._onProgress = options.onProgress;
    this._onAnswer = options.onAnswer;
    this._onScrollEnd = options.onScrollEnd;
  }

  // полезно для включения / выключения анимации из кода проекта.
  // например по кнопке, переключению страницы и т.д.
  public enable() {
    this.krono.enable();
  }

  public disable() {
    this.krono.disable();
  }

  public load() {
    this.krono.load();
  }

  private onLoad() {
    this.krono.optimizations.enabled = false;

    // чтобы вновь зашедший пользователь не застрял среди неотвеченных вопросов
    window.scrollTo(0, 0);

    if (this.lowQuality) {
      this.krono.optimizations.setPixelRatio(0.75);
      this.krono.optimizations.convertMaterialsToBasic(); // выключаем свет у материалов и сильно всё ускоряем
      // this.krono.optimizations.disablePostProcessing();
    }

    this.krono.scene.background = new Color(0xffffff);

    // if (location.search.includes('audio')) {
    //   this.krono.scene.add(new AmbientLight(0xffffff, 1));
    //   this.krono.scene.add(new DirectionalLight(0xffffff, 1));
    // }

    this.krono.camera.fov = 120;
    this.krono.camera.far = 1350; // хотфикс последней сцены, заменю эффектом
    this.krono.camera.updateProjectionMatrix();

    // console.log(this.krono.scene);

    this.addListenersToAnswers();
    this.krono.raycasting.updateObjectsToIntersect();
    
    // console.log(this.krono);

    requestAnimationFrame(this.tick.bind(this));
    
    // 🤫
    this.scrollContainer.addEventListener('scroll', () => {
      if (this.krono.scrollPercentage.y <= 0.04) {
        this.scrollMessageElement.classList.remove('hidden');
      } else {
        this.scrollMessageElement.classList.add('hidden');
      }

      if (this.krono.scrollPercentage.y <= 0.9998) { // срочный фикс вёрстки
        this.isScrollEnd = false;
      }
    }, false);

    this.suspendAudioContext();

    if (this.afterSceneLoaded) {
      this.afterSceneLoaded();
    }
  }

  private tick() {
    requestAnimationFrame(this.tick.bind(this));

    this.onScroll();
  }

  private onScroll() {
    const y = this.krono.scrollPercentage.y;
    const scrolls = Object.values(scenes).map(scene => scene.percentage);
    const closest = scrolls.reduce((prev, curr) => Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev);
    
    if (y > closest && this.answersToSend[scrolls.indexOf(closest)] === null) {
      const height = this.getScrollHeight() * closest;

      // чтобы можно было редактировать под флагом
      if (!location.search.includes('blank')) {
        window.scrollTo(0, height);
      }

      this.lockScroll();
    }

    if (this.krono.scrollPercentage.y >= 1 && !this.isScrollEnd) {
      this.onScrollEnd();
    }
  }

  private onScrollEnd() {
    this.isScrollEnd = true;

    this._onScrollEnd();
  }




  private getScrollHeight() {
    let windowHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );

    return windowHeight - this.krono.bounds.canvas.height;
  }

  // вкл / выкл звука
  public suspendAudioContext() {
    this.krono.suspendAudioContext();
  }

  public resumeAudioContext() {
    this.krono.resumeAudioContext();
  }

  private addListenersToAnswers() {
    const names = [];
    const questions = Object.keys(answers);
    questions.forEach(q => {
      for (let i = 1; i < 6; i++) {
        names.push(`${ q }_Answer_${ i }_Mat`);
      }
    });

    names.forEach(name => {
      const mesh = getObjectByMaterialName(this.krono.scene, name);
      mesh.addEventListener('pointerenter', this.onAnswerPointerEnter.bind(this));
      mesh.addEventListener('pointerleave', this.onAnswerPointerLeave.bind(this));
      mesh.addEventListener('pointerdown', this.onAnswerPointerEnter.bind(this));
      mesh.addEventListener('pointerup', this.onAnswerPointerUp.bind(this));

      const split = mesh.material.name.split('_');
      const question = split[0];
      const questionIndex = questions.indexOf(question);
      const color = answersColors[questionIndex][1];

      // changeVertexColors(mesh.geometry, color);

      // mesh.material.transparent = true;
      // mesh.material.opacity = 1;

      // ставим фильтрацию текстур у всех мешей, которые 
      // this.krono.scene
      //   .getObjectByName(name.replace('_Mat', ''))
      //   .traverse((obj: any) => {
      //     // @ts-ignore
      //     // console.log(obj.material);

      //     if (obj.material?.map) {
      //       // obj.material.map.magFilter = NearestFilter;
      //       // obj.material.map.minFilter = NearestFilter;
      //     }

      //     if (obj.material?.emissiveMap) {
      //       // obj.material.emissiveMap.magFilter = NearestFilter;
      //       // obj.material.emissiveMap.minFilter = NearestFilter;
      //     }
      //   });
    });
  }

  private onProgress(url, loaded, total) {
    // console.log(loaded, total); // dev thing

    let percent = loaded / this.totalResourcesCount;

    if (percent > 1) {
      percent = 1;
    }

    if (this._onProgress) {
      this._onProgress(percent);
    }
  }

  private onAnswerPointerEnter(event) {
    if (!this.isScrollDisabled) {
      return;
    }

    const mesh = event.target;
    const split = mesh.material.name.split('_');
    const questions = Object.keys(answers);
    const question = split[0];
    const questionIndex = questions.indexOf(question);
    const color = answersColors[questionIndex][0];

    // console.log(mesh);

    this.canvasContainer.style.cursor = 'pointer';
    

    // this.krono.scene.getObjectByName(mesh.material.name.replace('_Mat', '')).traverse(obj => {

    //   if (obj.material) {
    //     obj.material.transparent = true;
    //     obj.material.transparent = true;
    //   }
    // });


    // mesh.material.wireframe = true;
    // mesh.scale.set(1.1, 1.1, 1.1);
    mesh.material.transparent = true;
    mesh.material.opacity = 0.75;

    // changeVertexColors(mesh.geometry, color);
    // mesh.material.color =  color;
  }

  private onAnswerPointerLeave(event) {
    if (!this.isScrollDisabled) {
      return;
    }

    const mesh = event.target;
    const split = mesh.material.name.split('_');
    const questions = Object.keys(answers);
    const question = split[0];
    const questionIndex = questions.indexOf(question);
    const color = answersColors[questionIndex][1];

    // console.log(mesh, color);
  
    this.canvasContainer.style.cursor = 'default';
  
    // mesh.material.wireframe = false;
    // mesh.scale.set(1, 1, 1);
    mesh.material.transparent = false;
    mesh.material.opacity = 1;

    // changeVertexColors(mesh.geometry, color);
    // mesh.material.color =  color;
  }

  private onAnswerPointerUp(event) {
    if (!this.isScrollDisabled) {
      return;
    }

    const mesh = event.target;
    const split = mesh.material.name.split('_');
    const questions = Object.keys(answers);
    const question = split[0];
    const answer = split[2];
    const questionIndex = questions.indexOf(question);
    
    this.answersToSend[questionIndex] = answers[question][parseInt(answer) - 1];

    this.unlockScroll();

    const y = this.getScrollHeight() * (this.krono.scrollPercentage.y + this.onAnswerPointerUpScrollPercentage);
    this.scrollContainer.scrollTo(0, y);

    setTimeout(() => {
      const parentName = Object.keys(questionsData)[questions.indexOf(question)] + '_Question';
      this.krono.scene.getObjectByName(parentName).visible = false;
    }, 1000);

    this._onAnswer(questionIndex, Object.values(questionsData)[questionIndex], this.answersToSend[questionIndex]);
  }

  lockScroll() {
    // это нужно для того чтобы мы не могли случайно
    // тыкнуть на ответ во время скролла к вопросу
    setTimeout(() => {
      this.isScrollDisabled = true;
    }, 2500);

    disableBodyScroll(this.canvasContainer, {
      allowTouchMove: el => el.id === 'canvas-container'
    });
  }

  unlockScroll() {
    this.isScrollDisabled = false;

    enableBodyScroll(this.canvasContainer);
  }
}

export default Rukami;