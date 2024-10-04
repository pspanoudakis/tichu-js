import React from "react";

export function voidAction() {}

export function voidButton(event: React.BaseSyntheticEvent) {
    event.preventDefault();
}
