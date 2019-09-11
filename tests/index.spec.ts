import ServerTest from './server.spec';
import CreateServerTest from './createServer.spec';


console.info( '\nStart testing module.\n' );

interface Instance {
	count: number;
}

let instance: Instance = {
	count: 0
};

const poolOfFunctions = [
	( count: number, pool: object ) => new ServerTest( count, pool ),
	( count: number, pool: object ) => new CreateServerTest( count, pool ),
	( count: any, pool: any ) => console.info( `\nSuccess: [ ${ instance.count } ] modules was tested!\n` )
]

const functionStart = poolOfFunctions[ instance.count ];

functionStart( instance.count, poolOfFunctions );
