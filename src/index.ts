const devider = " | ";
const linkregex =
	/torrents\.php\?action=download.*?id=(\d+).*?authkey=.*?torrent_pass=(?=([a-z\d]+))\2(?!&)/i;

const baseURL = window.location.origin;

const alltorrents = [];
for (let i = 0; i < document.links.length; i++) {
	alltorrents.push(document.links[i]);
}

let allURL = "";
let url;

switch (window.location.href) {
	case (window.location.href.match(/\/torrents.php\?id/) || {}).input: {
		const query = getQueryParameters(document.location.search);

		for (const torrent of alltorrents) {
			if (linkregex.test(torrent)) {
				const torrentGroup = query.id;
				const torrentID = RegExp.$1;
				url =
					baseURL +
					"/torrents.php?id=" +
					torrentGroup +
					"\\&torrentid=" +
					torrentID;
				if (
					document
						.querySelectorAll(
							"[onclick^=\"$('#torrent_" + RegExp.$1 + "')\"]"
						)[0]
						.textContent.includes("Lossless")
				) {
					createLink(torrent, url);
					allURL +=
						baseURL +
						"/torrents.php?id=" +
						torrentGroup +
						"\\&torrentid=" +
						torrentID +
						" ";
				}
			}
		}

		break;
	}

	case (
		window.location.href.match(/\?type=uploaded.*?&filter=uniquegroup/) || {}
	).input:
	case (
		window.location.href.match(/\?type=uploaded.*?&filter=perfectflac/) || {}
	).input:
	case (window.location.href.match(/\?type=seeding/) || {}).input:
	case (window.location.href.match(/\?type=leeching/) || {}).input:
	case (window.location.href.match(/\?type=snatched/) || {}).input:
	case (window.location.href.match(/\?type=uploaded/) || {}).input: {
		for (const torrent of alltorrents) {
			const torrentRegex = /torrents.php\?id=(\d+)&torrentid=(\d+)/;
			if (torrentRegex.test(torrent)) {
				const torrentGroup = RegExp.$1;
				const torrentID = RegExp.$2;
				url =
					baseURL +
					"/torrents.php?id=" +
					torrentGroup +
					"\\&torrentid=" +
					torrentID;
				if (torrent.nextSibling.nodeValue.includes("Lossless")) {
					createLink(
						document.querySelectorAll(
							'[href^="torrents.php?action=download&id=' + torrentID + '&"]'
						)[0],
						url
					);
					allURL +=
						baseURL +
						"/torrents.php?id=" +
						torrentGroup +
						"&torrentid=" +
						torrentID +
						" ";
				}
			}
		}

		break;
	}

	case (window.location.href.match(/\/better.php\?method/) || {}).input: {
		for (const torrent of alltorrents) {
			const torrentRegex = /torrents.php\?id=(\d+)&torrentid=(\d+)/;
			if (torrentRegex.test(torrent)) {
				const torrentGroup = RegExp.$1;
				const torrentID = RegExp.$2;
				url =
					baseURL +
					"/torrents.php?id=" +
					torrentGroup +
					"&torrentid=" +
					torrentID;
				createLink(
					document.querySelectorAll(
						'[href^="torrents.php?action=download&id=' + torrentID + '&"]'
					)[0],
					url
				);
				allURL +=
					baseURL +
					"/torrents.php?id=" +
					torrentGroup +
					"&torrentid=" +
					torrentID +
					" ";
			}
		}

		break;
	}

	case (window.location.href.match(/\/artist.php/) || {}).input:
	case (window.location.href.match(/\/collages.php\?id/) || {}).input:
	case (window.location.href.match(/\/torrents.php/) || {}).input: {
		for (const torrent of alltorrents) {
			const torrentRegex = /torrents.php\?id=(\d+)&torrentid=(\d+)/;
			if (torrentRegex.test(torrent)) {
				const torrentGroup = RegExp.$1;
				const torrentID = RegExp.$2;
				url =
					baseURL +
					"/torrents.php?id=" +
					torrentGroup +
					"&torrentid=" +
					torrentID;
				if (torrent.textContent.includes("Lossless")) {
					createLink(
						document.querySelectorAll(
							'[href^="torrents.php?action=download&id=' + torrentID + '&"]'
						)[0],
						url
					);
					allURL +=
						baseURL +
						"/torrents.php?id=" +
						torrentGroup +
						"&torrentid=" +
						torrentID +
						" ";
				}
			}
		}

		break;
	}

	default: {
		break;
	}
}

function createLink(linkelement, url) {
	const link = document.createElement("RO");
	link.append(document.createElement("a"));
	link.firstChild.append(document.createTextNode("RO"));
	link.append(document.createTextNode(devider));
	link.firstChild.title = "Copy red_oxide command to clipboard";
	linkelement.parentNode.insertBefore(link, linkelement);

	link.addEventListener("mouseover", () => {
		link.firstChild.style["text-decoration"] = "underline";
		link.firstChild.style.cursor = "pointer";
	});

	link.addEventListener("mouseout", () => {
		link.firstChild.style["text-decoration"] = "none";
		link.firstChild.style.cursor = "inherit";
	});

	const string = `red_oxide transcode -c config.json ${url}`;

	link.addEventListener("contextmenu", generateAll, false);

	link.addEventListener(
		"click",
		async () => {
			await GM.setClipboard(string, "text");
			const original = link.firstChild.getAttribute("style");
			link.firstChild.setAttribute("style", "color: #63b708 !important");
			setTimeout(() => {
				link.firstChild.setAttribute("style", original);
			}, 2000);
		},
		false
	);
}

function getQueryParameters(qs) {
	qs = qs.split("+").join(" ");

	const parameters = {};
	let tokens;
	const re = /[?&]?([^=]+)=([^&]*)/g;

	while ((tokens = re.exec(qs))) {
		parameters[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return parameters;
}

function generateAll(event) {
	event.preventDefault();
	const string = `red_oxide transcode -c config.json ${allURL}`;

	GM.setClipboard(string, "text");
	const original = event.srcElement.getAttribute("style");
	event.srcElement.setAttribute("style", "color: #63b708 !important");
	setTimeout(() => {
		event.srcElement.setAttribute("style", original);
	}, 2000);
}
