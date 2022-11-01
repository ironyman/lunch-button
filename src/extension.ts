// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let channel: any;

async function burgerMe(meal: string) {
	// This is a notification, nobody looks at those.
	// vscode.window.showInformationMessage('Chill getting your burger');
	channel.show();
	channel.appendLine("Burgering");

	// output appears in vscode host debug console
	// require('child_process').execSync(String.raw`powershell -file "C:\Users\changyl\OneDrive - Microsoft\bin\lunch\buylunch.ps1"`)

	// output only appears after child process exits
	// const { promisify } = require('util');
	// const exec = promisify(require('child_process').exec)
	// let output = await exec(String.raw`powershell -file "C:\Users\changyl\OneDrive - Microsoft\bin\lunch\buylunch.ps1"`)
	// channel.appendLine(output.stdout.trim());

	let child = require('child_process').exec(String.raw`powershell -file "C:\Users\changyl\OneDrive - Microsoft\bin\lunch\buylunch.ps1" -meal ` + meal)
	child.stdout.setEncoding('utf8');
	child.stdout.on('data', function(data: string) {
		channel.append(data);
	});
	child.stderr.setEncoding('utf8');
	child.stderr.on('data', function(data: string) {
		channel.append(data);
	});
	child.on('close', function(code: any) {
		channel.appendLine("Finished burgering exit code: " + code);
	});
}

async function burgerMe2(meal: string) {
	let term = vscode.window.createTerminal("Burger");
	term.sendText(String.raw`powershell -file "C:\Users\changyl\OneDrive - Microsoft\bin\lunch\buylunch.ps1" -meal ` + meal);
	term.sendText(String.raw`exit`, false);
	term.show();
}

async function burgerConfirmation() {
	// I don't think showQuickPick will return my type even if I could pass it in
	// items as vscode.QuickPickItem[] 
	// interface Item extends vscode.QuickPickItem {
	// 	meal: string | null;
	// };

	let items: vscode.QuickPickItem[] = [
		{
			label: "No boirgir",
			description: "No thx, kbye",
		},
		{
			label: "Sandwich boirgir",
			description: "I would like sandwich",
			detail: "lunch",
		},
		{
			label: "Eggs boirgir",
			description: "I would like egg scrabble",
			detail: "breakfast",
		}
	];

	let picked = await vscode.window.showQuickPick(items as vscode.QuickPickItem[], {
		title: "CAn You haz burger?",
		canPickMany: false,
	});
	// if (picked?.label == items[1].label) {
	// 	burgerMe2();
	// }
	if (picked?.detail?.length && picked?.detail?.length > 0) {
		burgerMe2(picked?.detail!!);
	}
}

export function activate(context: vscode.ExtensionContext) {
	// order? https://github.com/microsoft/vscode/issues/35744
	// https://stackoverflow.com/questions/41009664/how-can-i-change-the-buttons-order-of-the-status-bar-in-vscode
	const button = vscode.window.createStatusBarItem("Burger", vscode.StatusBarAlignment.Left, 99999999999999999999999);
	button.text = '🍔';
	button.name = 'Burger 🍔';

	button.command = 'lunch-button.burger';
	button.show();

	channel = vscode.window.createOutputChannel("Burger");

	let disposable = vscode.commands.registerCommand('lunch-button.burger', burgerConfirmation);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
