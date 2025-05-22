const { Op } = require('sequelize');
const Champion = require('../../models/champion'); // ścieżka do modelu
const ChampionTag = require('../../models/championTag');
const CronJob =require('cron').CronJob;
const { Sequelize } = require('sequelize');

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


async function getChampions(req, res) {
  try {
    // Handle both array and single value cases
    let roles = req.query.roles;
    if (roles) {
      roles = Array.isArray(roles) ? roles : [roles];
      roles = roles.map(role => role.toLowerCase());
    }

    if (!roles || roles.length === 0) {
      // If no roles selected, return all champions
      let champions = await Champion.findAll({
        include: [{
          model: ChampionTag
        }]
      });
      return res.send(champions);
    }

    // Find champions that have ALL selected roles
    let champions = await Champion.findAll({
      include: [{
        model: ChampionTag,
        required: true,
        where: {
          tag: {
            [Op.in]: roles
          }
        }
      }],
      group: ['Champion.id'],
      having: Sequelize.literal(`COUNT(DISTINCT "ChampionTags"."tag") = ${roles.length}`),
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('ChampionTags.tag')), 'tagCount']
        ]
      }
    });

    // Get full champion data with all their tags
    if (champions.length > 0) {
      champions = await Champion.findAll({
        where: {
          id: {
            [Op.in]: champions.map(c => c.id)
          }
        },
        include: [{
          model: ChampionTag
      }]  
    });
    }

    res.send(champions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania championów");
  }
}

async function getRandomChamp(req, res) {
  try {
    // Get roles from query params if they exist
    let roles = req.query.roles;
    if (roles) {
      roles = Array.isArray(roles) ? roles : [roles];
      roles = roles.map(role => role.toLowerCase());
    }

    let query = {
      include: [{
        model: ChampionTag
      }]
    };

    // If roles are specified, filter by them
    if (roles && roles.length > 0) {
      query.include[0].required = true;
      query.include[0].where = {
        tag: {
          [Op.in]: roles
        }
      };
      query.group = ['Champion.id'];
      query.having = Sequelize.literal(`COUNT(DISTINCT "ChampionTags"."tag") = ${roles.length}`);
    }

    // Get all matching champions
    const champions = await Champion.findAll(query);

    if (champions.length === 0) {
      return res.status(404).json({
        error: "No champions found",
        message: "No champions found matching the selected criteria"
      });
    }

    // Select a random champion
    const randomIndex = Math.floor(Math.random() * champions.length);
    const randomChampion = champions[randomIndex];

    res.json(randomChampion);
  } catch (err) {
    console.error('Error in getRandomChamp:', err);
    res.status(500).json({
      error: "Server error",
      message: "Error selecting random champion"
    });
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



  



module.exports={updateChampions, getChampions, getRandomChamp}
