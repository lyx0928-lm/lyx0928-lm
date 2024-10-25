document.addEventListener("DOMContentLoaded", function() {
    const composers = [
        {name: "Beethoven", link: "javascript:;"},
        {name: "Bizet", link: "javascript:;"},
        {name: "Brahms", link: "javascript:;"},
        {name: "Bruckner", link: "javascript:;"},
        {name: "Chopin", link: "javascript:;"},
        {name: "Dvorak", link: "javascript:;"},
        {name: "Grieg", link: "javascript:;"},
        {name: "Handel", link: "javascript:;"},
        {name: "Haydn", link: "javascript:;"},
        {name: "Holst", link: "javascript:;"},
        {name: "Mendelssohn", link: "javascript:;"},
        {name: "Mahler", link: "javascript:;"},
        {name: "Mozart", link: "javascript:;"},
        {name: "Mussorgsky", link: "javascript:;"},
        {name: "Schubert", link: "javascript:;"},
        {name: "Schumann", link: "javascript:;"},
        {name: "Shostakovich", link: "javascript:;"},
        {name: "Sibelius", link: "javascript:;"},
        {name: "Smetana", link: "javascript:;"},
        {name: "Strauss", link: "javascript:;"},
        {name: "Verdi", link: "javascript:;"},
        {name: "Vivaldi", link: "javascript:;"}
    ];

    const container = document.getElementById("composer-links");

    composers.forEach(composer => {
        const a = document.createElement("a");
        a.href = composer.link;
        a.textContent = composer.name;
        a.className = composer.link === "javascript:;" ? "classify-name" : "";
        container.appendChild(a);
    });
});


document.addEventListener("DOMContentLoaded", function() {
  const baseUrl = 'https://telegraph-image-u87.pages.dev/file/';
  const images = [
    { part: '01b86bb35b554ae110964', description: 'Roma ore 11' },
    { part: '06c7c4ce797050f4b506f', description: 'Mad Max Fury Road' },
    { part: '084ba5b036f34ac41200b', description: 'Cinema Paradiso' },
    { part: '0861c5b221422f7306a14', description: 'Snatch' },
    { part: '0c02ef3d7e9207926667e', description: 'All About Eve' },
    { part: '0e455872072ddaa98ec7f', description: 'The Shop Around the Corner' },
    { part: '0f14fa965dd548ceeafe7', description: 'Play Time' },
    { part: '10a0000e352d415b1ccd6', description: 'Matrix Reloaded' },
    { part: '119f63139c880a4c790f4', description: 'Mon Oncle' },
    { part: '18544d52eb1fdbde48d60', description: 'Moonrise Kingdom' },
    { part: '19a6bc04dcc34569de175', description: 'Zelig' },
    { part: '1a8363658efaf8fbba397', description: 'It Happened One Night' },
    { part: '1bb8bdeebe25895d3b596', description: 'Face Off' },
    { part: '1eeaed4df1d74d2ee380e', description: 'Groundhog Day' },
    { part: '20e63d352389b350800a2', description: 'Lawrence of Arabia' },
    { part: '2128539807627da56ec42', description: 'Lego DC Comics Super Heroes: The Flash' },
    { part: '22ba34927b7f084a8264e', description: 'Strangers on a Train' },
    { part: '233c2e6a4a8c559f42692', description: 'North by Northwest' },
    { part: '23ee211b0af747c86a1bd', description: 'Inglourious Bastreds' },
    { part: '264d289754951a142ee3a', description: 'The Naked City' },
    { part: '26a2b12f8abeb03baf76d', description: 'Quiz Show' },
    { part: '26e19b963a3288be0c1e9', description: 'Runaway Jury' },
    { part: '27cebe9f134f20fea46e8', description: 'Inception' },
    { part: '287d9b0cce70145e323d6', description: 'Du rififi chez les hommes' },
    { part: '2d043190a65796c78c428', description: 'Kingsman: The Secret Service' },
    { part: '2d5babf15de378a0a303d', description: 'Cat on a Hot Tin Roof' },
    { part: '2e16c924a2ce5f2dc162b', description: 'Double Indemnity' },
    { part: '2e785f2b323efc2cef552', description: 'Dune: Part 1' },
    { part: '3112e147f0dea8f88fe8b', description: 'Around the World in Eighty Days' },
    { part: '31cae0379bf34f9534831', description: 'Pulp Fiction' },
    { part: '32eb525f4da4f1ebaf434', description: 'The Young Philadelphians' },
    { part: '32f7e10968951c3c9545a', description: 'Batman Begins' },
    { part: '3307637b9433bd795ce86', description: 'The Boondock Saints' },
    { part: '38d9024d121e029e47cf7', description: 'The Butterfly Effect' },
    { part: '3ecf3418c56192862f8c7', description: 'The Odd Couple' },
    { part: '416ba6184d8c7ef71a3ec', description: 'Out of the Past' },
    { part: '433d7e1ffc9a7f0444cf0', description: 'La tulipe noire' },
    { part: '43414074b783870535ebb', description: 'V for Vendetta' },
    { part: '4380646f57d01c45d7fb4', description: 'Nightmare Alley' },
    { part: '43f22bb6c9e34af38db24', description: 'True Grit' },
    { part: '488cde4dd4d9b26c16faf', description: 'Lord of the Rings: The Two Towers' },
    { part: '48c9a624e855ea1c6ca7e', description: 'The Truman Show' },
    { part: '49123c46ad7ef17e56ac4', description: "Ocean's 11"},
    { part: '4c18d86344276658164c9', description: 'Kingdom of Heaven' },
    { part: '4cf80220af56494c710d3', description: 'Witness for the Prosecution' },
    { part: '4d3a7ac8935e513806dae', description: 'The French Dispatch' },
    { part: '4d6ef9afd74ec7484ad8c', description: "Ocean's 12" },
    { part: '5068d340f0d10d157cf39', description: 'The Killing' },
    { part: '51413ae84c07d397455c1', description: 'Primal Fear' },
    { part: '52319887c35ae3a3aebce', description: 'Marple: The Body in the Library' },
    { part: '526437795856e837f7928', description: 'Lord of the Rings: The Return of the King' },
    { part: '52d73fd204f8992018819', description: 'Lego DC Comics Super Heroes: Justice League - Attack of the Legion of Doom!' },
    { part: '5332813a99b72d273472f', description: 'Atomic Blonde' },
    { part: '539f0265200452dcf3860', description: 'The Bridge on the River Kwai' },
    { part: '564285efd34a14ad9e86c', description: 'Murder on the Orient Express' },
    { part: '56974250194d68fe56cb3', description: 'Giù la testa' },
    { part: '58dffcd8a3e7430675863', description: '20,000 Leagues Under the Sea' },
    { part: '58eff4116c42068301bfa', description: 'Sissi II: Die junge Kaiserin' },
    { part: '59a2133cc551bc0de48f4', description: 'Mary Poppins' },
    { part: '5bbd4b6739fb8c44c1543', description: 'Sunset Boulevard' },
    { part: '5e115ade42b004cc72706', description: 'Pride and Prejudice' },
    { part: '5eb0773678d629ad49252', description: 'Lock, Stock and Two Smoking Barrels' },
    { part: '63076c474a4d9e7f492ba', description: 'Bullet Train' },
    { part: 'f54d4dc8075e8f08b59cc', description: "Harry Potter 1: the Sorcerer's Stone" },
    { part: '35561d519d5d908f8b207', description: 'Harry Potter 2: the Chamber of Secrets' },
    { part: '31bf9fd5053d4421cb727', description: 'Harry Potter 3: the Prisoner of Azkaban' },
    { part: 'fdab992c94fc4499e19cc', description: 'Harry Potter 4: the Goblet of Fire' },
    { part: 'b89b169d5c7dfd73ed263', description: 'Harry Potter 5: the Order of the Phoenix' },
    { part: '7a294484a16a8b5e32931', description: 'Harry Potter 6: the Half-Blood Prince' },
    { part: '53404f38b34ef31abecd0', description: 'Harry Potter 7: the Deathly Hallows: Part 1' },
    { part: 'bc75e3e96750577cf0671', description: 'Harry Potter 7: the Deathly Hallows: Part 2' },
    { part: '660f29827b59cee9c40e7', description: 'Beetlejuice' },
    { part: '6713cab09afdd4d0b2428', description: 'Se7en' },
    { part: '68fcb266efca39d3d8fb9', description: 'Ben-Hur' },
    { part: '6a2756e57dec8c4fbad47', description: 'Rio Bravo' },
    { part: '6c651f5aded422600bb75', description: 'Lego DC Comics Super Heroes: Batman - Family Matters' },
    { part: '6d529cb1bb3a7ea1045aa', description: 'Vertigo' },
    { part: '6ef3b3f8efcfbc13ee406', description: 'Boss Level' },
    { part: '70c67c62784fae7eda6a2', description: 'Black Hawk Down' },
    { part: '71aa6ad8367cde8a83f0f', description: 'The Dark Knight Rises' },
    { part: '71c1648c331db0023e919', description: 'Isle of Dogs' },
    { part: '7317decaf94d51d335ba9', description: 'Plein soleil' },
    { part: '7427f70bfa49067045004', description: 'Lord of the Rings: The Fellowship of the Ring' },
    { part: '77aecda405935387a47cc', description: 'Ready Player One' },
    { part: '7889c739606e09c21c9d9', description: 'Zootopia' },
    { part: '7a6acada0fb3956447eb3', description: 'Baby Driver' },
    { part: '7aff568ea85d072d9c470', description: 'Monsieur Verdoux' },
    { part: '7b281d62e46e66597d6c0', description: 'Blade Runner' },
    { part: '7cee4caa07bcf3a417647', description: 'Matrix' },
    { part: '7ddac31cce4f9f8c8eff2', description: 'Charlie and the Chocolate Factory' },
    { part: '7fd1d94b4f7c606c6034c', description: 'Sissi III: Schicksalsjahre einer Kaiserin' },
    { part: '803e3e5969faf59a48255', description: 'Constantine' },
    { part: '81869578c155336099bd0', description: 'The Great Escape' },
    { part: '837126b77a2d6f4b8911d', description: 'The Front Page' },
    { part: '83b5f9159ebe8677f032a', description: 'Marple: A Murder Is Announced' },
    { part: '83f2316b2503066c9875a', description: 'A Tale of Two Cities' },
    { part: '869c317b72da71c9a4077', description: 'Treasure Island' },
    { part: '8818bb20fd72efe29b5f5', description: 'La grande vadrouille' },
    { part: '8c9a6a0b44b5ff67c6240', description: 'The Usual Suspects' },
    { part: '8ea5c596578ed87fade7c', description: 'Le samouraï.' },
    { part: '8f7e2f348510a0a6b3546', description: 'Anatomy of a Murder' },
    { part: '901e5d462af0b59040505', description: 'Return to Oz' },
    { part: '944b780943fb38e82710d', description: 'Hotel Mumbai' },
    { part: '94cac5d916bf8d8852eff', description: 'Con Air' },
    { part: '967d3b177516ad4d8cd6c', description: 'Dial M for Murder' },
    { part: '97bdfca071f10d5e43c48', description: 'Memento' },
    { part: '97e8c658c23fcbe9dff7d', description: 'Sherlock Holmes A Game of Shadows' },
    { part: '98af2903578ba61d6b65a', description: 'Spider-Man 1' },
    { part: '99e8469bba8fb14517684', description: 'Spellbound' },
    { part: '9b45eb5d6b78eb8011bf5', description: 'Catch Me If You Can' },
    { part: '9bde121a0327956c7cffa', description: 'Abre los ojos' },
    { part: '9cc875fd51165e9fc74f3', description: 'Minority Report' },
    { part: '9cdbfd445b8f884b70997', description: '1408' },
    { part: '9da7adafa772abb05f7a1', description: 'Fight Club' },
    { part: '9e21ffba8eab5f9b3344a', description: 'Dark City' },
    { part: '9edfd6434918dfb2f9542', description: "Ocean's 13" },
    { part: '9fa1338b52ebaddda311f', description: 'Chicago' },
    { part: 'a3a52214db94fee0286cf', description: 'Big Fish' },
    { part: 'a3cb42b1d39e2958f9f42', description: 'Sissi I' },
    { part: 'a47e2d6b5df8834231013', description: 'Battlestar Galactica' },
    { part: 'a51be3b4805c94240da1a', description: 'The Spy Who Came in from the Cold' },
    { part: 'a6186ddac06747636e414', description: 'Cinderella' },
    { part: 'a6f3935536951289648d4', description: 'The Fugitive' },
    { part: 'a72c7dcb2c98a67a8ae7f', description: 'Casablanca' },
    { part: 'a7fa88ac982a4ca1e225e', description: 'Dune: Part 2' },
    { part: 'a8a723bae010a7ac3613b', description: 'Psycho' },
    { part: 'a98c128dc189d204881f6', description: 'The Prestige' },
    { part: 'aac9c2261dddc287be719', description: "The Time Traveler's Wife" },
    { part: 'ad546f51d92eb5c6bb176', description: 'Where Eagles Dare' },
    { part: 'ad67a9a3620beef4e178a', description: 'Matrix Revolutions' },
    { part: 'b0bd5ceb4545d6a1c7414', description: 'The Lost Weekend' },
    { part: 'b6308dcdf8f69faab56de', description: 'Rebecca' },
    { part: 'b82cd148ebe7b2a6214f8', description: 'The Dark Knight' },
    { part: 'b8cf1e5dd2232d6f94a45', description: '福尔摩斯探案集' },
    { part: 'b90bedf58f5abeca91068', description: 'The Hustler' },
    { part: 'b930bca21db308b1317f9', description: 'A Place in the Sun' },
    { part: 'ba6330af17547524f5964', description: 'The Gentlemen' },
    { part: 'bb8d65afbd5095c77195b', description: 'Identity' },
    { part: 'bc64f31224fd786769b40', description: 'Rear Window' },
    { part: 'c28783efb5af8b9b3959a', description: 'The Man from U.N.C.L.E.' },
    { part: 'c53b6125cfa3d573667ce', description: 'Roman Holiday' },
    { part: 'c57ca88023ab9814d923a', description: 'IL gattopardo' },
    { part: 'c62872171376904339bc9', description: 'Chinatown' },
    { part: 'c7ba5f1adf0be050361a1', description: 'The Ghost Writer' },
    { part: 'c7c4b4dd0277db346c9c2', description: 'Moon' },
    { part: 'c8388bd823ab8bc9ec09c', description: 'Sherlock Holmes' },
    { part: 'c98da68a77ea26c2bd41e', description: 'Frequency' },
    { part: 'c9d8ee616c81dff21a538', description: 'Giant' },
    { part: 'ca687026e82cbec259465', description: 'Spider-Man 3' },
    { part: 'cf1c8a16dbe01c0b87cc9', description: 'Schindlers List' },
    { part: 'd141a7c1c6882dc3f0c27', description: 'Lego DC Comics Super Heroes: Justice League - Cosmic Clash' },
    { part: 'd204cf4713cfe5897b71a', description: '3:10 to Yuma' },
    { part: 'd41e1277db3a67d589541', description: 'Gattaca' },
    { part: 'd55bfcdb264c993d2c8ae', description: "Singin' in the Rain" },
    { part: 'd71f3bdeea37a3838c450', description: '12 Angry Men' },
    { part: 'd74a043681949c80370a9', description: 'One Two Three' },
    { part: 'd7dcba708298512c6a288', description: 'The Sixth Sense' },
    { part: 'd8e4062df180d61d38dff', description: 'L.A.Confidential' },
    { part: 'db2776e4f0883161d407d', description: 'Le trou' },
    { part: 'dbda3184f09c2401a45d6', description: 'The Grand Budapest Hotel' },
    { part: 'e15e0f2507b4a7778c5d5', description: 'Interstellar' },
    { part: 'e257461dd8def91c03320', description: 'Murder by Death' },
    { part: 'e88cbdb1e22f97ed57ca2', description: 'The Big Short' },
    { part: 'e8dcfae9c155dd2edc248', description: 'Mrs Miniver' },
    { part: 'e8dd9a781575f33c9464b', description: 'Stalag 17' },
    { part: 'eb7c53ed67a54f0856673', description: 'To Be or Not to Be' },
    { part: 'eb8cc220581f7c620f1dc', description: 'Mulholland Drive' },
    { part: 'ec5164eb42d094f989419', description: 'Munich' },
    { part: 'ec8f6046ffc80637584e5', description: 'Terminator 2' },
    { part: 'ed26a5a8279f1bdcb4a8f', description: 'Pleasantville' },
    { part: 'ed6d0c7853e59fc4fff84', description: 'Gladiator' },
    { part: 'ee40b6bc1008cd6a92ee5', description: 'The Lady Vanishes' },
    { part: 'f1399d3dfc55728926b96', description: 'Ace in the Hole' },
    { part: 'f53dbcc109f3abadade1c', description: 'Source Code' },
    { part: 'f6e818ff5c296f8de198f', description: 'Kind Hearts and Coronets' },
    { part: 'f7b60c13a59d211c6caa1', description: 'The Mask of Zorro' },
    { part: 'f7bcd1ee0f7d410312146', description: 'The Wizard of Oz' },
    { part: 'f8d1fecaa5fd71853c0d7', description: 'Red Dragon' },
    { part: 'fb08ba7519ac7c0e6c9c6', description: 'The Apartment' },
    { part: 'fb31143c0ffc13e311d03', description: 'Journey to the Center of the Earth' },
    { part: 'fdce333f07650d85fef8f', description: 'Sin City' },
    { part: 'fe1ae1ef293f57b30bf7e', description: 'Freud The Secret Passion' },
    { part: 'fe40294b807ed8bbbacb4', description: 'Spider-Man 2' },
    { part: 'ff3fec726551e490dd6e2', description: 'On the Waterfront' },
    { part: 'ff99693bbb7e9cb25a5c7', description: 'Judgment at Nuremberg' },
    { part: 'c505d237220d370b66d68', description: 'Training Day' },
    { part: '0170fb6a28869c57ff90b', description: 'American Gangster' },
    { part: '3556fa54b0863d759bf6a-83deca26edb6d33acb', description: 'The Return of Sherlock Holmes' },
  ];

  // 按照 description 的首字母排序
images.sort((a, b) => {
  // 将 description 转换为小写，确保不区分大小写
  const descA = a.description.toLowerCase();
  const descB = b.description.toLowerCase();
  
  // 按照字母顺序排序
  if (descA < descB) return -1;
  if (descA > descB) return 1;
  return 0;
});

console.log(images);

  const container = document.querySelector('.card-container');

  images.forEach(image => {
    const fullUrl = `${baseUrl}${image.part}.jpg`;

    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundImage = `url(${fullUrl})`;
    card.style.backgroundSize = 'contain';
    card.style.backgroundRepeat = 'no-repeat';

    const content = document.createElement('div');
    content.className = 'content';

    const description = document.createElement('p');
    description.textContent = image.description;

    const button = document.createElement('button');
    button.textContent = '阅读更多';
    button.addEventListener('click', () => {
      alert(`你点击了 ${image.title}`);
    });

    content.appendChild(description);
    content.appendChild(button);
    card.appendChild(content);

    container.appendChild(card);
  });
});


