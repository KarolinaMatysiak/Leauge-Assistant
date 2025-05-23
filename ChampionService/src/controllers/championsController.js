const { Op } = require('sequelize');
const Champion = require('../../models/champion'); // ścieżka do modelu
const ChampionTag = require('../../models/championTag');
const CronJob =require('cron').CronJob;
const { Sequelize } = require('sequelize');
const { sequelize } = require('../connections/db-connection')

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
//bierze championa z bazy danych
    for (const champ of champions) {
      const champion = await Champion.findOrCreate({
        where: { name: champ.name },
        defaults: {
          imgUrl: champ.image,
        }
      });
//bierze do niego taga z bazy
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
    // zwraca roles albo zapakowuje w arraya
    let roles = req.query.roles;
    if (roles) {
      roles = Array.isArray(roles) ? roles : [roles];
      roles = roles.map(role => role.toLowerCase());
    }

    if (!roles || roles.length === 0) {
      // zwraca wszytskich gdy nie ma roles w query
      let champions = await Champion.findAll({
        include: [{
          model: ChampionTag
        }]
      });
      return res.send(champions);
    }

    // zwraca champa ktory zawiera wszystkie z wybranych roli
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

    // pobiera championy z jego danymi spelniajace filtr
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
    let roles = req.query?.roles ?? [];
    if (roles) {
      roles = Array.isArray(roles) ? roles : [roles];
      roles = roles.map(role => role.toLowerCase());
    }

    //pobiera championa na podstawie jego roli i ilosci rol aby potraktowac to jako and
    const [randomChampion] = await sequelize.query(`
      SELECT c.*
      FROM champions c
      INNER JOIN champions_tags ct ON ct.championId = c.id
      ${roles && roles.length ? "WHERE ct.tag IN (:roles)" : ""}
      GROUP BY c.id
      ${roles && roles.length ? "HAVING COUNT(DISTINCT ct.tag) = :roleCount" : ""}
      ORDER BY RANDOM()
      LIMIT 1
    `, {
      replacements: {
        roles: roles || [],
        roleCount: roles?.length || 0
      },
      type: Sequelize.QueryTypes.SELECT
    });
    if(!randomChampion) {
      res.status(404).json({message: "Random champion not found"})
      return;
    }

//wyciaga tagi do championa
    const tags = await sequelize.query(`
      SELECT *
      FROM champions_tags
      WHERE championId = :championId
    `, {
      replacements: { championId: randomChampion.id },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json({...randomChampion, ChampionTags: tags.map(tagData => ({ tag: tagData.tag})) });
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
