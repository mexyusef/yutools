import * as vscode from 'vscode';

const activeConnections = new Map<string, RTCPeerConnection>();

async function initializeConnection() {
  const connectionId = await vscode.window.showInputBox({
      prompt: 'Enter a unique identifier for the WebRTC connection:',
      validateInput: value => value ? '' : 'Connection ID cannot be empty.'
  });

  if (connectionId) {
      const pc = new RTCPeerConnection();
      activeConnections.set(connectionId, pc);
      vscode.window.showInformationMessage(`WebRTC connection "${connectionId}" initialized.`);
  }
}

async function createOffer() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            vscode.window.showInformationMessage(`Offer created for connection "${connectionId}". Share this SDP:

${offer.sdp}`);
        }
    }
}

async function acceptOffer() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            const sdp = await vscode.window.showInputBox({ prompt: 'Paste the SDP of the received offer:' });
            if (sdp) {
                const offer = new RTCSessionDescription({ type: 'offer', sdp });
                await pc.setRemoteDescription(offer);
                vscode.window.showInformationMessage(`Offer accepted for connection "${connectionId}".`);
            }
        }
    }
}

async function createAnswer() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            vscode.window.showInformationMessage(`Answer created for connection "${connectionId}". Share this SDP:

${answer.sdp}`);
        }
    }
}

async function acceptAnswer() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            const sdp = await vscode.window.showInputBox({ prompt: 'Paste the SDP of the received answer:' });
            if (sdp) {
                const answer = new RTCSessionDescription({ type: 'answer', sdp });
                await pc.setRemoteDescription(answer);
                vscode.window.showInformationMessage(`Answer accepted for connection "${connectionId}".`);
            }
        }
    }
}

async function manageIceCandidates() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            pc.onicecandidate = event => {
                if (event.candidate) {
                    vscode.window.showInformationMessage(`New ICE Candidate for connection "${connectionId}":

${JSON.stringify(event.candidate)}`);
                }
            };
            vscode.window.showInformationMessage(`Listening for ICE candidates on connection "${connectionId}".`);
        }
    }
}

async function listActiveConnections() {
    const connections = Array.from(activeConnections.keys());
    if (connections.length > 0) {
        vscode.window.showQuickPick(connections, {
            placeHolder: 'Select a connection to view details:'
        });
    } else {
        vscode.window.showInformationMessage('No active WebRTC connections.');
    }
}

async function closeConnection() {
    const connectionId = await selectConnection();
    if (connectionId) {
        const pc = activeConnections.get(connectionId);
        if (pc) {
            pc.close();
            activeConnections.delete(connectionId);
            vscode.window.showInformationMessage(`Connection "${connectionId}" closed and removed.`);
        }
    }
}

async function selectConnection(): Promise<string | undefined> {
    const connections = Array.from(activeConnections.keys());
    if (connections.length > 0) {
        return vscode.window.showQuickPick(connections, {
            placeHolder: 'Select a WebRTC connection:'
        });
    } else {
        vscode.window.showInformationMessage('No active WebRTC connections.');
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('yutools.webrtc.initializeConnection', initializeConnection),
        vscode.commands.registerCommand('yutools.webrtc.createOffer', createOffer),
        vscode.commands.registerCommand('yutools.webrtc.acceptOffer', acceptOffer),
        vscode.commands.registerCommand('yutools.webrtc.createAnswer', createAnswer),
        vscode.commands.registerCommand('yutools.webrtc.acceptAnswer', acceptAnswer),
        vscode.commands.registerCommand('yutools.webrtc.manageIceCandidates', manageIceCandidates),
        vscode.commands.registerCommand('yutools.webrtc.listActiveConnections', listActiveConnections),
        vscode.commands.registerCommand('yutools.webrtc.closeConnection', closeConnection),
    );
    vscode.window.showInformationMessage('YuTools WebRTC Extension Activated!');
}

export function deactivate() {
    activeConnections.forEach((pc, id) => pc.close());
    activeConnections.clear();
}
