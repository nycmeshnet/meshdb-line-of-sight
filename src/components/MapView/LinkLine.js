import React from "react";
import { Polyline } from "@react-google-maps/api";

export default function LinkLine(props) {
	const { link } = props;
	const { nodes, devices } = link; // TODO: This is weird
	const { lat: lat1, lng: lng1 } = devices[0];
	const { lat: lat2, lng: lng2 } = devices[1];
	const path = [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }];
	const strokeColor = getColor(
		nodes[0],
		nodes[1],
		devices[0],
		devices[1],
		link
	);
	const strokeOpacity = getOpacity(
		nodes[0],
		nodes[1],
		devices[0],
		devices[1],
		link
	);
	const strokeWeight = getWeight(
		nodes[0],
		nodes[1],
		devices[0].type,
		devices[1].type,
		link
	);
	const zIndex = getZIndex(
		nodes[0],
		nodes[1],
		devices[0].type,
		devices[1].type
	);
	const options = {
		strokeColor,
		strokeWeight,
		strokeOpacity,
		zIndex
	};
	return <Polyline path={path} options={options} />;
}

const isSupernode = node => node.name && node.name.includes("Supernode");
const isHub = node => node.notes && node.notes.includes("Hub");
const isOmni = device => device.name && device.name.indexOf("omni") !== -1;
const isBackbone = (node, device) =>
	isSupernode(node) || isHub(node) || isOmni(device);

function getColor(node1, node2, device1, device2, link) {
	if (link.status === "los") return "#f0f";
	if (isBackbone(node1, device1) && isBackbone(node2, device2))
		return "rgb(0,122,255)";
	return "rgb(255,45,85)";
}

function getOpacity(node1, node2, device1, device2, link) {
	if (link.status === "los") return 1;
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 1;
	if (isBackbone(node1, device1) && isBackbone(node2, device2))
		return 0.75;
	return 0.5;
}

function getWeight(node1, node2, device_type1, device_type2, link) {
	if (link.status === "los") return 2;
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2.5;
	return 1.5;
}

function getZIndex(node1, node2, device_type1, device_type2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2;
	return 1;
}
