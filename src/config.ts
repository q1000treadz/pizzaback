import * as fs from 'fs';

const configData = fs.readFileSync('envconfig.json');
const config = JSON.parse(configData.toString());
export default config;
