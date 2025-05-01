const Champion = require('../../models/champion'); // ścieżka do modelu


async function updateChampions(req,res)
{
  try {
    let roles = req.query.roles;
    const champions = await getLatestDDragon();

    for (const champ of champions) {
      await Champion.findOrCreate({
        where: { name: champ.name },
        defaults: {
          imgUrl: champ.image
        }
      });
    }

    if (Array.isArray(roles) && roles.length) {
      const filteredChampions = champions.filter(champ =>
        champ.tags.some(tag => roles.includes(tag))
      );
      return res.send(filteredChampions);
    }

    res.send(champions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania championów");
  }
}


async function getChampions(req,res){
const championsList =
}


async function getLatestDDragon() {
    const versions = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const latest = (await versions.json())[0];
  
    const ddragon = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`
    );
  
    const champions = (await ddragon.json()).data;
  
    const championJson = Object.values(champions).map((champion, index) => ({
      newId: `champ-${index + 1}`,
      id: champion.id,
      name: champion.name,
      key: champion.key,
      tags: champion.tags,
      image: `https://ddragon.leagueoflegends.com/cdn/${latest}/img/champion/${champion.image.full}`,
    }));
  
    return championJson;
  }



  



module.exports={updateChampions}