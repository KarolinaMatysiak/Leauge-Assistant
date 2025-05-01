const Champion = require('./champion');
const ChampionTag = require('./championTag');

function setModelRelation()
{
Champion.hasMany(ChampionTag, {
    foreignKey: {
        name: 'championId'
    }
});
ChampionTag.belongsTo(Champion);
}

module.exports = { setModelRelation}