from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.5) for (i, j) in edges]


class Election(Scene):

    def construct(self):
        self.camera.background_color = "#F9F2E5"
        
       
        intro = Text("II. LEADER ELECTION IN RINGS", color=BLACK, font="DejaVu Sans Mono").scale(0.7)

        self.play(Create(intro))
        self.wait(1)
        self.play(FadeOut(intro))
        self.wait(1)

        caption = Text("POINT DOMINANCE", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(3.5*UP)

        nodes = [Dot(color=RED_E, radius=0.15, point=1.5*LEFT + DOWN), Dot(color=BLUE_E, radius=0.15, point=1.5*RIGHT + UP)]
        tex = [Tex(r"$p$", font_size=120, color=RED_E).scale(0.3).move_to(1.5*LEFT + 1.5*DOWN),
               Tex(r"$q$", font_size=120, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 0.5*UP),
               Tex(r"$(p_x, p_y)$", font_size=100, color=RED_E).scale(0.3).move_to(1.5*LEFT + 0.5*DOWN),
               Tex(r"$(q_x, q_y)$", font_size=100, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 1.5*UP)]

        plane = NumberPlane(x_range=[-10,10,0.3], y_range=[-10, 10, 0.3], x_length=50, y_length=50, faded_line_style={'stroke_width': 0},
                            x_axis_config=dict(stroke_width=0), y_axis_config=dict(stroke_width=0), background_line_style=dict(stroke_opacity=0.35))

        self.play(Create(caption))
        self.add(plane)
        self.play(*[FadeIn(x) for x in nodes]) 
        self.play(*[Create(x) for x in tex])
        self.wait(1)

        formula = [Tex(r"If $p_y > q_y$, then we say $p \succ q$ ($p$ dominates $q$).", font_size=100, color=BLACK).scale(0.3).move_to(3*DOWN + 2*LEFT),
                   Tex(r"If $p_y = q_y$, then we say $p \succ q$ only if $p_x > q_x$.", font_size=100, color=BLACK).scale(.3).move_to(3.5*DOWN+2.06*LEFT)]

        self.play(Create(formula[0]))
        self.play(Create(formula[1]))

        square = Rectangle(color=BLUE_E, width=15, height=5)
        square.set_fill(BLUE_D, opacity=1)

        inThisCase = Tex(r"$q \succ p$", font_size=100, color=WHITE).scale(0.5).move_to(4*RIGHT+UP)

        square.surround(inThisCase, buff=0.5)


        self.wait(5)
        self.play(Create(square))
        self.play(Create(inThisCase))
        self.wait(5)

        path1 = Line(1.5*RIGHT + UP, 1.5*RIGHT + DOWN)

        moveQ = VGroup(*[tex[1], tex[3], nodes[1]])

        self.play(MoveAlongPath(moveQ, path1))

        self.wait(3)

        path2 = Line(1.5*RIGHT + DOWN, 1.2*RIGHT + 1.8*DOWN)
        square.set_color(RED_E)
        square.set_fill(RED_D, opacity=1)

        otherCas = Tex(r"$p \succ q$", font_size=100, color=WHITE).scale(0.5).move_to(4*RIGHT+UP)
        square.surround(otherCas, buff=0.5)

        self.play(*[MoveAlongPath(moveQ, path2), FadeIn(square), FadeOut(inThisCase), FadeIn(otherCas)])

        self.wait(1)

        moveP = VGroup(*[tex[0], tex[2], nodes[0]])

        path3 = Line(1.5*LEFT + DOWN, 3*LEFT + 2*UP)

        self.play(MoveAlongPath(moveP, path3))