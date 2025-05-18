const { Op } = require('sequelize');
const Champion = require('../../models/champion'); // ścieżka do modelu
const ChampionTag = require('../../models/championTag');
const CronJob =require('cron').CronJob;

const job = new CronJob(
'0 22 * * *',
updateChampions,
null,
true,
'Europe/Warsaw');
job.start()



async function updateChampions()
{
  try {
    const champions = await getLatestDDragon();

    for (const champ of champions) {
      const champion = await Champion.findOrCreate({
        where: { name: champ.name },
        defaults: {
          imgUrl: champ.image,
        }
      });

      const insertedChampionId = champion[0]?.id;
      for (const tag of champ.tags) {
        await ChampionTag.findOrCreate({
          where: {championId: insertedChampionId, tag: tag.toLowerCase()
           },
        })
      }
    }

   console.log('championi zaktualizowani')
  } catch (err) {
    console.error(err);
  }
}


async function getChampions(req,res){
  try {
    const roles = req.query.roles?.map(role => role.toLowerCase());

    let champions = await Champion.findAll({
      include: [{
        model: ChampionTag,
        where: roles?.length ? {
          tag: {
            [Op.in]: roles
          }} : undefined,
      }]  
    });

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
