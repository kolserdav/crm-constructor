#! /usr/bin/env node

const process = require( 'process' );
const exec = require( 'child_process' ).exec;
const fs = require( 'fs' );
const path = require( 'path' );
const package = require( path.normalize( '../package.json' ) );
const appPath = path.resolve( __dirname, '../app' );
const nodePath = path.resolve( __dirname, '../lib' );
const sourcePath = path.resolve( __dirname, '..' );
const rootDir = process.cwd();

const colors = {
	reset: "\x1b[0m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	cyan: "\x1b[36m"
};

( async () => {
	await getArgs();
} )()

function clearStdout() {
	process.stdout.clearLine();
  process.stdout.cursorTo( 0 );
}

async function execCommand( command ) {
	const message = `Exec command: ${ colors.cyan } ${ command }`;
	console.info( colors.reset, `${ message } ...`, colors.reset );
	const load = [ '/', '-', '\\', '|' ];
	this._load = 0;
	const sI = setInterval( () => {
		clearStdout();
		process.stdout.write( load[ this._load ] );
		this._load ++;
		this._load = ( load[ this._load ] ) ? this._load : 0;
	}, 250 );
	return await new Promise( ( resolve, reject ) => {
		exec( command, {}, ( error, stdout, stderr ) => {
			if ( error ) reject( error );
			if ( stderr.length  !== 0 ) {
				clearStdout();
				console.warn( colors.yellow, stderr);
			}
			clearInterval( sI );
			clearStdout();
			console.info( colors.green, '[ OK ]', colors.reset, message, colors.reset );
			resolve( stdout );
		} );
	}).
		catch( e => {
			console.error( colors.red, `Error: ${ message } `, e );
			process.exit()
		} );
}

async function getArgs() {
	const argv = process.argv;
  if ( ! argv[ 2 ] ) {
    console.info( colors.reset, '\nUsage: "crm [OPTIONS] COMMAND"\n\nType: "crm --help" to get command list' );
  }
  else if ( argv[ 2 ] === '--help' || argv[ 2 ] === '-h' ) {
    console.info( colors.reset, `\nUsage: "crm [OPTIONS] COMMAND"\n\nOptions:
      \r\t-h, --help\tCommand list
    \nCommands:
      \r\tcreate\tCreate project  
      ` );
  }
	else if ( argv[ 2 ] === '--version' || argv[ 2 ] === '-v' ) {
		console.info( colors.reset, package.name, package.version );
	}
  else {
    for ( let i = 0; argv[ i ]; i ++ ) {
      const nextValue = argv[ i + 1 ];
			if ( argv[ i ] === '--help' || argv[ i ] === '-h' ) {
				await commandList( argv[ i - 1 ], { help: true } );
			}
			else {
				await commandList( argv[ i ], { nextValue: nextValue } );
			}
    }
  }
}

async function commandList( command, options ) {
	const { help, nextValue } = ( options )? options : { help: false, nextValue: null };
	let _error = false;
	const nextIsHelp = ( nextValue )? ( nextValue === '--help' || nextValue === '-h' ) : false;
	switch ( command ) {
		 case 'create':
			console.info( colors.reset, '\nStarted the program of create CRM template.\n' );
			const nodeVersion = await execCommand( 'node --version', 'Check Nodejs version.' );
			const nodeVersionClear = nodeVersion.replace( /[v\n]/g, '' );
			if ( nodeVersionClear < '10.15.3' ) {
				console.error( `\nNodejs version must be higher than v10.15.3, Your version ${ nodeVersionClear }` );
				process.exit();
			}
			if ( ! help ) {
				if ( typeof nextValue !== 'string' && !nextIsHelp ) {
					console.error( colors.red, '\nArgument after command "create" must be of type string' );
					_error = true;
				}
				else {
					await createApp( nextValue );
					await createApp( nextValue, 'app' );
					await createApp( nextValue, 'lib' );
					console.info( `CRM template installed in to directory: ${ nextValue }` );
				}
			}
			else {
				console.info( colors.reset, '\nUsage command <create>: "crm create [OPTIONS] SERVICE"' )
			}
			break;
	}
	if ( _error ) console.info( colors.reset, '"crm command --help" to get command reference' );
}

async function createDir( appName ) {
	this._createDir = false;
	await new Promise( ( resolve, reject ) => {
		fs.stat( appName, err => {
			if (err) reject( err );
			resolve ( 'Success' );
		} );
	} ).
		catch( e => {
			this._createDir = true;
		} );
	if ( this._createDir ) {
		const message = `Create dir: ${ appName }`;
		console.info( colors.reset, `${ message } ...` );
		this._createAppDir = true;
		await new Promise( ( resolve, reject ) => {
			fs.mkdir( appName, {}, ( err ) => {
				if ( err ) reject( err );
				console.info( colors.green, '[ OK ]', colors.reset, message );
				resolve( 'Success' );
			} );
		} ).
			catch( e => {
				if ( parseInt( e.errno ) !== -17 ) {
					this._createAppDir = false;
					console.error( colors.red, 'Directory can\'t create', e );
				}
			} );
		return this._createAppDir;
	}
}

async function getFilesFromPath( appPath ) {
	return await new Promise( ( resolve, reject ) => {
    fs.readdir( appPath, {}, ( error, items ) => {
      if ( error ) reject( error );
      resolve( items );
    } );
  } ).
    catch( e => {
      console.error( colors.red, `Can't read ${ appPath } directory`, e );
    } );
}

async function getStatsFromPath( itemPath ) {
	return await new Promise( ( resolve, reject ) => {
		fs.stat( itemPath, {}, ( error, stats ) => {
			if ( error ) reject( error );
			resolve( stats );
		} );
	} ).
		catch( e => {
			console.error( colors.red, `Cannot get stats from path: ${ itemPath }`, e );
		} );
}

async function copyFile( source, destination ) {
	const message =  `Copy file:  ${ source }, ${ destination }`; 
	console.info( colors.reset, `${ message } ...` );
	this._copyFile = true;
  await new Promise( ( resolve, reject ) => {
		fs.copyFile( source, destination, ( err ) => {
			if ( err ) reject( err );
			console.info( colors.green, `[ OK ]`, colors.reset, message );
			resolve( 'Success' );
		} );
	} ).
		catch( e => {
			this._copyFile = false;
			console.error( colors.red, `Error: ${ message }`, e );
		} );
	return this._copyFile;
}


async function createApp( appName, dirName ) {
	let pathApp = ( ! dirName )? sourcePath : nodePath;
	pathApp = ( dirName === 'app' )? appPath : pathApp;
	const createdAppPath = path.normalize( `${ rootDir }/${ appName }` );
	const reactDir = path.normalize( `${ createdAppPath }/${ dirName }` );
	await createDir( createdAppPath );
	if ( dirName ) await createDir( reactDir );
	const files = await getFilesFromPath( pathApp );
	for ( let i = 0; files[ i ]; i ++ ) {
		const sourceFilesPath = path.normalize( `${ pathApp }/${ files[ i ] }` );
		const subCreatedPrefix = ( dirName )? `${ createdAppPath }/${ dirName }/${ files[ i ] }` : `${ createdAppPath }/${ files[ i ] }`;
		const subCreatedAppPath = path.normalize( subCreatedPrefix );
		const stats = await getStatsFromPath( sourceFilesPath );
		const _isDir = stats.isDirectory();
		if ( _isDir && files[ i ] !== 'node_modules' && files[ i ] !== 'build' && files[ i ] !== '.git' && dirName) {
			const subFiles = await getFilesFromPath( sourceFilesPath );
			await createDir( subCreatedAppPath );
			for ( let index = 0; subFiles[ index ]; index ++ ) {
				const subItemPath = path.normalize( `${ sourceFilesPath }/${ subFiles[ index ] }` );
				const subDirFile = path.normalize( `${ subCreatedAppPath }/${ subFiles[ index ] }` );
				const subStats = await getStatsFromPath( subItemPath );
				const _isDirSub = subStats.isDirectory();
				if ( ! _isDirSub ) {
					await copyFile( subItemPath, subDirFile );
				}
				else {
					const subSubFiles = await getFilesFromPath( subItemPath );
					await createDir( subDirFile );
					for ( let i1 = 0; subSubFiles[ i1 ]; i1 ++ ) {
						const subSubItemPath = path.normalize( `${ subItemPath }/${ subSubFiles[ i1 ] }` );
						const subSubDirFile = path.normalize( `${ subDirFile }/${ subSubFiles[ i1 ] }` );
						await copyFile( subSubItemPath, subSubDirFile );
					}
				}
			}
		}
		else if ( ! _isDir ) {
			await copyFile( sourceFilesPath, subCreatedAppPath );
		}
	}
	if ( dirName && dirName === 'app' ) {
		const res = await execCommand( `cd ${ reactDir } && npm install`, `Install ${ dirName } app...` );
		console.info( res );
	}
	else if ( dirName && dirName === 'lib' ) {
		const res = await execCommand( `cd ${ createdAppPath } && npm install`, `Install ${ createdAppPath } app...` );
    console.info( res );
	}
}
