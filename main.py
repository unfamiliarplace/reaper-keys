import pygame
from pygame import Surface as S

N_BEATS_PER_MEASURE = 16
N_MEASURES = 2
N_OCTAVES = 2

SCALE = 2

W_L_BAR = SCALE * 1
W_R_BAR_1 = SCALE * 3
W_R_BAR_2 = SCALE * 1
W_WHITE = SCALE * 191
W_BLACK = SCALE * 109
W_BEAT = SCALE * 10
W_BEAT_DIV = SCALE * 1
W_MEASURE = ((N_BEATS_PER_MEASURE * (W_BEAT + W_BEAT_DIV)) - W_BEAT_DIV)
W_MEASURE_DIV = SCALE * 1

H_WHITE = SCALE * 25
H_WHITE_DIV = SCALE * 1
H_BLACK = SCALE * 15
H_OCTAVE_DIV = SCALE * 1
H_OCTAVE = ((7 * (H_WHITE + H_WHITE_DIV)) - H_WHITE_DIV)

YO_BLACK = (70, 50, 30, None, 60, 40, None)

C_BG = '000000'
C_WHITE = 'ffffff'
C_BLACK = '000000'
C_L_BAR = 'abb1b1'
C_R_BAR_1 = 'abb1b1'
C_R_BAR_2_WHITE = '5c5c5c'
C_R_BAR_2_BLACK = '555555'
C_WHITE_DIV = '5d5d5d'
C_ROW_WHITE = '464646'
C_ROW_BLACK = '3e3e3e'
C_ROW_WHITE_DIV = '3e3e3e'
C_ROW_OCTAVE_DIV = '383838'
C_OCTAVE_DIV = '111111'
C_WHITE_DIV_BEAT_DIV = '363636'
C_BEAT_DIV_BLACK = '363636'
C_BEAT_DIV_WHITE = '3d3d3d'
C_MEASURE_DIV_WHITE = '383838'
C_MEASURE_DIV_BLACK = '313131'

W = sum((W_L_BAR, W_WHITE, W_R_BAR_1, W_R_BAR_2, ((N_MEASURES * (W_MEASURE + W_MEASURE_DIV)) - W_MEASURE_DIV)))
H = (N_OCTAVES * (H_OCTAVE + H_OCTAVE_DIV)) - H_OCTAVE_DIV

pygame.init()
pygame.display.set_caption('Keys')
window = pygame.display.set_mode([W, H])

# Handy...
def d(surface: S, colour: str, coords: tuple[int]):
    pygame.draw.rect(surface, f'#{colour}', coords)

def b(parent: S, child: S, coords: tuple[int]):
    parent.blit(child, coords)

def ob(i: int, d_block: int, d_div: int) -> int:
    """Offset of a given block"""
    d_combined = d_block + d_div
    return i * d_combined

def od(i: int, d_block: int, d_div: int) -> int:
    """Offset of a given divider"""
    d_combined = d_block + d_div
    return (i * d_combined) + d_block

def obod(i: int, d_block: int, d_div: int) -> tuple[int]:
    return ob(i, d_block, d_div), od(i, d_block, d_div)

def seq(s: S, n: int, draw_block: callable, draw_div: callable=None, args_db: list=[], args_dd: list=[]):
    for i in range(n - 1):
        draw_block(s, i, *args_db)
        if draw_div:
            draw_div(s, i, *args_dd)
    draw_block(s, n - 1, *args_db)

# Components

def draw_white(s: S, i: int):
    y = ob(i, H_WHITE, H_WHITE_DIV)
    d(s, C_WHITE, (0, y, W_WHITE, H_WHITE))

def draw_white_div(s: S, i: int):
    y = od(i, H_WHITE, H_WHITE_DIV)
    d(s, C_WHITE_DIV, (0, y, W_WHITE, H_WHITE_DIV))

def draw_black(s: S, i: int):
    if YO_BLACK[i] is None:
        return
    
    # h = H_BLACK - H_WHITE_DIV
    yo = ((YO_BLACK[i] * H_BLACK) / 100)
    y = ob(i + 1, H_WHITE, H_WHITE_DIV) - yo
    d(s, C_BLACK, (0, y, W_BLACK, H_BLACK))

def draw_row_black(s: S, i: int):
    if YO_BLACK[i] is None:
        return
    
    yo = ((YO_BLACK[i] * H_BLACK) / 100)
    y = ob(i + 1, H_WHITE, H_WHITE_DIV) - yo
    d(s, C_ROW_BLACK, (0, y, W_MEASURE, H_BLACK))
    
    seq(s, N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_black, [], [y])

def draw_beat(s: S, i: int):
    return

def draw_beat_div_white(s: S, i: int):
    x = od(i, W_BEAT, W_BEAT_DIV)
    d(s, C_BEAT_DIV_WHITE, (x, 0, W_BEAT_DIV, H_OCTAVE))

def draw_beat_div_black(s: S, i: int, y: int):
    x = od(i, W_BEAT, W_BEAT_DIV)
    d(s, C_BEAT_DIV_BLACK, (x, y, W_BEAT_DIV, H_BLACK))

def draw_measure(s: S, i: int):
    me = S((W_MEASURE, H))

    d(me, C_ROW_WHITE, (0, 0, W_MEASURE, H_OCTAVE))
    d(me, C_ROW_WHITE_DIV, (0, od(3, H_WHITE, H_WHITE_DIV), W_MEASURE, H_WHITE_DIV))
    seq(me, N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_white)
    seq(me, 7, draw_row_black)

    x = (W_WHITE + W_R_BAR_1 + W_R_BAR_2) + ob(i, W_MEASURE, W_MEASURE_DIV)
    b(s, me, (x, 0))

def draw_measure_div(s: S, i: int):
    x = (W_WHITE + W_R_BAR_1 + W_R_BAR_2) + od(i, W_MEASURE, W_MEASURE_DIV)
    d(s, C_MEASURE_DIV_BLACK, (x, 0, W_MEASURE_DIV, H_OCTAVE))

def draw_keys(s: S):
    seq(s, 7, draw_white, draw_white_div)
    seq(s, 7, draw_black)

def draw_measures(s: S):    
    seq(s, N_MEASURES, draw_measure, draw_measure_div)

def draw_octave(s: S, i: int):
    me = S((W - W_L_BAR, H_OCTAVE))

    draw_keys(me)
    draw_measures(me)

    y = ob(i, H_OCTAVE, H_OCTAVE_DIV)
    b(s, me, (W_L_BAR, y))

def draw_octave_div(s: S, i: int):
    y = od(i, H_OCTAVE, H_OCTAVE_DIV)
    d(s, C_OCTAVE_DIV, (W_L_BAR, y, W_WHITE, H_OCTAVE_DIV))
    d(s, C_ROW_OCTAVE_DIV, ((W_L_BAR + W_WHITE + W_R_BAR_1 + W_R_BAR_2), y, W, H_OCTAVE_DIV))

# Main loop
running = True
while running:

    # Check events
    for event in pygame.event.get():

        # User clicks window close button
        if event.type == pygame.QUIT:
            running = False

    # Draw    
    d(window, C_BG, (0, 0, W, H))
    seq(window, N_OCTAVES, draw_octave, draw_octave_div)
    d(window, C_L_BAR, (0, 0, W_L_BAR, H))
    d(window, C_R_BAR_1, (W_L_BAR + W_WHITE, 0, W_R_BAR_1, H))
    d(window, C_R_BAR_2_WHITE, (W_L_BAR + W_WHITE + W_R_BAR_1, 0, W_R_BAR_2, H))

    # Update the display
    pygame.display.flip()

# Quit the window
pygame.quit()
