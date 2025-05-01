const Champion = require('../../models/champion'); // ścieżka do modelu


async function updateChampions(req,res)
{
  try {
    const champions = await getLatestDDragon();

    for (const champ of champions) {
      await Champion.findOrCreate({
        where: { name: champ.name },
        defaults: {
          imgUrl: champ.image
        }
      });
    }

    res.status(200).send("Championi zaktualizowani");
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas aktualizacji championów");
  }
}


async function getChampions(req,res){
  try {
    const roles = req.query.roles;

    let champions = await Champion.findAll();

    if (Array.isArray(roles) && roles.length) {
      champions = champions.filter(champ => {
        const tags = JSON.parse(champ.tags || "[]");
        return tags.some(tag => roles.includes(tag));
      });
    }

    res.send(champions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania championów");
  }
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



  



module.exports={updateChampions, getChampions}
